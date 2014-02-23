package controllers

import play.api.mvc._
import play.api.Logger
import scala.concurrent.Future
import play.api.libs.concurrent.Execution.Implicits._
import services.{Invitees, Groups}
import play.api.libs.json.{Json, JsValue}
import Json._
import reactivemongo.bson.BSONObjectID
import play.modules.reactivemongo.json.BSONFormats

object Application extends Controller {

  private val logger = Logger(getClass)

  private implicit val objectIdFormat = BSONFormats.BSONObjectIDFormat

  def root = Action.async {
    Future(Redirect(routes.Application.index))
  }

  def index = Authenticated.async {
    request =>
      Future(Ok(views.html.index()))
  }

  private def mkLoginAction(code: String, result: JsValue => SimpleResult) = Action.async {
    Groups.findOneByCode(code).flatMap {
      groupOption =>
        groupOption.map {
          group =>
            val id = (group \ "_id").as[BSONObjectID]

            Invitees
              .findByGroupId(id)
              .map(invitees => group ++ obj("invitees" -> invitees))
              .map(result(_))
              .map(_.withSession(Security.username -> id.stringify))
        } getOrElse {
          Future(Unauthorized)
        }
    }
  }

  def enter(code: String) = mkLoginAction(code, _ => Redirect(routes.Application.index))

  def login(code: String) = mkLoginAction(code, Ok(_))

  def exit = Action.async {
    Future(Redirect(routes.Application.index).withNewSession)
  }

  def logout = Action.async {
    Future(Ok.withNewSession)
  }
}
