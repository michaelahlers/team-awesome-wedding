package controllers

import play.api.mvc._
import play.api.Logger
import scala.concurrent.Future
import play.api.libs.concurrent.Execution.Implicits._
import services.Groups
import play.api.libs.json.JsValue
import reactivemongo.bson.BSONObjectID
import play.modules.reactivemongo.json.BSONFormats

object Application extends Controller {

  private val logger = Logger(getClass)

  private implicit val objectIdFormat = BSONFormats.BSONObjectIDFormat

  def root = Action.async {
    Future(Redirect(routes.Application.index))
  }

  def index = Action.async {
    Future(Ok(views.html.index()))
  }

  private def mkLoginAction(code: String, result: JsValue => SimpleResult) = Action.async {
    for {
      groupOption <- Groups.findOneByCode(code)
    } yield {
      groupOption.map {
        group =>
          result(group).withSession(Security.username -> (group \ "_id").as[BSONObjectID].stringify)
      } getOrElse {
        Unauthorized
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
