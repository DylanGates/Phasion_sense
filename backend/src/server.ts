import { buildApp } from "./app"
import { getConfig } from "./config"

const config = getConfig()
const app = buildApp({ config })

async function main() {
  try {
    await app.listen({ port: config.port, host: "0.0.0.0" })
    app.log.info(`Phasion Sense backend listening on ${config.port}`)
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

void main()
