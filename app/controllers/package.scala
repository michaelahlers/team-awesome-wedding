import play.api.Logger
import play.api.mvc._
import reactivemongo.bson.BSONObjectID
import scala.concurrent.Future
import services.Groups
import play.api.libs.concurrent.Execution.Implicits._

package object controllers {

  private val logger = Logger(getClass)

  object Authenticated extends ActionBuilder[Request] {
    override def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[SimpleResult]) = {
      request.session.get(Security.username) match {
        case None =>
          for {
            result <- block(request)
          } yield result.withNewSession

        case Some(maybeId) =>
          for {
            idOption <- Future(BSONObjectID.parse(maybeId).toOption)
            groupOption <- idOption.map(Groups.findOneById).getOrElse(Future(None))
            result <- block(request)
          } yield {
            groupOption match {
              case Some(group) => result
              case None => result.withNewSession
            }
          }

      }
    }
  }

}
