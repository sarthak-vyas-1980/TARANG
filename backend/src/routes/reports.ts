import { Hono } from 'hono'
import { formatSuccess, formatError } from '../utils/helpers.js'
import { createPrismaClient } from '../lib/prisma.js'

// Define enum literals manually
const HazardTypes = ['TSUNAMI', 'STORM_SURGE', 'HIGH_WAVES', 'COASTAL_FLOODING', 'ABNORMAL_TIDE'] as const
type HazardType = (typeof HazardTypes)[number]

const Severities = ['LOW', 'MEDIUM', 'HIGH'] as const
type Severity = (typeof Severities)[number]

const Statuses = ['PENDING', 'VERIFIED', 'INVESTIGATING', 'REJECTED'] as const
type Status = (typeof Statuses)[number]



interface UpdateStatusBody {
  status: string
}

const reports = new Hono<{
  Bindings:{
    DATABASE_URL:string;
    JWT_SECRET:string;
  },
  Variables: {
    prisma: ReturnType<typeof createPrismaClient>;
  };
}>()

// GET /api/reports - list all reports with reporter details
reports.get('/', async (c) => {
  const prisma = c.get('prisma');
  try {
    const allReports = await prisma.report.findMany({
      include: { reporter: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return c.json(formatSuccess({ reports: allReports }))
  } catch (error) {
    console.error('Get reports error:', error)
    return c.json(formatError('Failed to fetch reports'), 500)
  }
})

// POST /api/reports - create new report
interface CreateReportBody {
  type: string
  description: string
  severity?: string
  locationName: string  // Add location fields
  lat: number
  lng: number
}

// POST /api/reports - create new report with location
reports.post('/', async (c) => {
  const prisma = c.get('prisma');
  try {
    const { userId } = c.get('jwtPayload') as { userId: number }
    const body = await c.req.json() as CreateReportBody

    let { type, description, severity = 'LOW', locationName, lat, lng } = body

    if (!type || !description || !locationName || lat === undefined || lng === undefined) {
      return c.json(formatError('Type, description, locationName, lat, and lng are required'), 400)
    }

    const typeUpper = type.toUpperCase()
    const severityUpper = severity.toUpperCase()

    if (!HazardTypes.includes(typeUpper as HazardType)) {
      return c.json(formatError(`Invalid hazard type: ${type}`), 400)
    }

    if (!Severities.includes(severityUpper as Severity)) {
      return c.json(formatError(`Invalid severity: ${severity}`), 400)
    }

    // Create or find location first
    let location = await prisma.location.findFirst({
      where: {
        name: locationName,
        lat: lat,
        lng: lng
      }
    })

    if (!location) {
      location = await prisma.location.create({
        data: {
          name: locationName,
          lat: lat,
          lng: lng
        }
      })
    }

    // Now create report with locationId
    const report = await prisma.report.create({
      data: {
        type: typeUpper as any,
        description: description.trim(),
        severity: severityUpper as any,
        reporterId: userId,
        locationId: location.id  // Required field!
      },
      include: {
        reporter: {
          select: { id: true, name: true, email: true }
        },
        location: true  // Include location in response
      }
    })

    return c.json(formatSuccess({ report }, 'Report created successfully'), 201)

  } catch (error: unknown) {
    if (
      typeof error === 'object' && error !== null &&
      'code' in error && (error as any).code === 'P2025'
    ) {
      return c.json(formatError('Record not found'), 404)
    }
    console.error('Create report error:', error)
    return c.json(formatError('Failed to create report'), 500)
  }
})


// GET /api/reports/:id - get single report by ID
reports.get('/:id', async (c) => {
  const prisma = c.get('prisma');
  try {
    const id = parseInt(c.req.param('id'))
    if (isNaN(id)) {
      return c.json(formatError('Invalid report ID'), 400)
    }

    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        reporter: { select: { id: true, name: true, email: true } }
      }
    })

    if (!report) {
      return c.json(formatError('Report not found'), 404)
    }

    return c.json(formatSuccess({ report }))
  } catch (error) {
    console.error('Get report error:', error)
    return c.json(formatError('Failed to fetch report'), 500)
  }
})

// PUT /api/reports/:id/status - update report status (OFFICIAL only)
reports.put('/:id/status', async (c) => {
  const prisma = c.get('prisma');
  try {
    const { userId } = c.get('jwtPayload') as { userId: number }
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || user.role !== 'OFFICIAL') {
      return c.json(formatError('Forbidden: Only OFFICIAL users can update report status'), 403)
    }

    const { status } = await c.req.json() as UpdateStatusBody
    const id = parseInt(c.req.param('id'))
    if (isNaN(id)) {
      return c.json(formatError('Invalid report ID'), 400)
    }

    const statusUpper = status.toUpperCase()
    if (!Statuses.includes(statusUpper as Status)) {
      return c.json(formatError(`Invalid status: ${status}`), 400)
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: { status: statusUpper as any },
      include: {
        reporter: { select: { id: true, name: true, email: true } }
      }
    })

    return c.json(formatSuccess({ report: updatedReport }, 'Report status updated successfully'))

  } catch (error: unknown) {
    if (
      typeof error === 'object' && error !== null &&
      'code' in error && (error as any).code === 'P2025'
    ) {
      return c.json(formatError('Report not found'), 404)
    }
    console.error('Update report status error:', error)
    return c.json(formatError('Failed to update report status'), 500)
  }
})

// DELETE /api/reports/:id - delete report by ID (own report or OFFICIAL only)
reports.delete('/:id', async (c) => {
  const prisma = c.get('prisma');
  try {
    const { userId } = c.get('jwtPayload') as { userId: number }
    const id = parseInt(c.req.param('id'))
    if (isNaN(id)) {
      return c.json(formatError('Invalid report ID'), 400)
    }

    const [user, report] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } }),
      prisma.report.findUnique({ where: { id }, select: { id: true, reporterId: true } })
    ])

    if (!user) return c.json(formatError('User not found'), 404)
    if (!report) return c.json(formatError('Report not found'), 404)

    if (report.reporterId !== userId && user.role !== 'OFFICIAL') {
      return c.json(formatError('Forbidden: You can only delete your own reports'), 403)
    }

    await prisma.report.delete({ where: { id } })

    return c.json(formatSuccess({}, 'Report deleted successfully'))

  } catch (error) {
    console.error('Delete report error:', error)
    return c.json(formatError('Failed to delete report'), 500)
  }
})

export default reports


