import path from 'node:path'

import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

const openApiPath = path.resolve(__dirname, '..', '..', 'docs', 'openapi.yaml')
const swaggerSpec = YAML.load(openApiPath)

export { swaggerSpec, swaggerUi }