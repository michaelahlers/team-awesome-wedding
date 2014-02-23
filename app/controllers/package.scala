import play.api.mvc._
import scala.concurrent.Future
import services.Groups
import play.api.libs.concurrent.Execution.Implicits._

package object controllers {

  class AuthenticatedRequest[A](val username: String, request: Request[A]) extends WrappedRequest[A](request)

  object Authenticated extends ActionBuilder[Request] {
    override def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[SimpleResult]) = {
      request.session.get(Security.username) match {
        case None =>
          for {
            result <- block(request)
          } yield result.withNewSession

        case Some(code) =>
          for {
            groupOption <- Groups.findOneByCode(code)
            result <- block(request)
          } yield {
            groupOption match {
              case None => result.withNewSession
              case Some(group) => result
            }
          }
      }
    }
  }

}
