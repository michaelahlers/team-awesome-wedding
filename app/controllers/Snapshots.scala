package controllers

import play.api.Logger
import java.io.{InputStream, File}
import scala.concurrent.Future
import play.api.libs.json.{Json, JsValue}
import play.api.libs.json.Json._
import java.nio.file.{Files, Path}
import scala.io.Source
import play.api.libs.concurrent.Execution.Implicits._

object Snapshots {
  private val logger = Logger(getClass)

  def restore(snapshot: File): Future[JsValue] = restore(snapshot.toPath)

  def restore(snapshot: Path): Future[JsValue] = restore(Files.newInputStream(snapshot))

  def restore(snapshot: InputStream): Future[JsValue] = {
    restore(
      Source
        .fromInputStream(snapshot)
        .getLines()
        .mkString("")
    )
  }

  def restore(snapshot: String): Future[JsValue] = restore(Json.parse(snapshot))

  def restore(snapshot: JsValue): Future[JsValue] = {
    val groups = (snapshot \ "groups").as[Seq[JsValue]].map(mkGroup)
    val invitees = (snapshot \ "invitees").as[Seq[JsValue]].map(d => mkInvitee(groups, d))

    Future
      .sequence(groups ++ invitees)
      .map(_ => snapshot)
  }

  private def mkGroup(definition: JsValue): Future[JsValue] = {
    services.Groups.upsertByCode(obj(
      "code" -> definition \ "code"
    ))
  }

  private def mkInvitee(groups: Seq[Future[JsValue]], definition: JsValue): Future[JsValue] = {
    for {
      group <- groups((definition \ "group" \ "_ref").as[Int])
      invitee <- services.Invitees.upsertByName(obj(
        "name" -> definition \ "name",
        "group" -> obj(
          "_id" -> group \ "_id"
        )
      ))
    } yield invitee
  }
}