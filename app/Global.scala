import controllers.Snapshots
import play.api._
import play.api.Play._

object Global extends GlobalSettings {
  private val logger = Logger(getClass)

  private implicit val defaultContext = play.api.libs.concurrent.Execution.defaultContext

  override def onStart(app: Application) {
    resourceAsStream("snapshot.json") map {
      snapshot =>
        Snapshots.restore(snapshot)
    }
  }

  override def onStop(app: Application) {
  }

}
