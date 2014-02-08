import play.api._

object Global extends GlobalSettings {
  private val logger = Logger(getClass)

  private implicit val defaultContext = play.api.libs.concurrent.Execution.defaultContext

  override def onStart(app: Application) {
  }

  override def onStop(app: Application) {
  }

}
