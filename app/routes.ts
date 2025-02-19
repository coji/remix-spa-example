import { nextRoutes } from 'rr-next-routes'

export default nextRoutes({
  folderName: 'routes',
  print: 'info',
  layoutFileName: 'layout',
  routeFileNames: ['page', 'route'],
  extensions: ['.tsx', '.ts', '.jsx', '.js'],
  routeFileNameOnly: true,
})
