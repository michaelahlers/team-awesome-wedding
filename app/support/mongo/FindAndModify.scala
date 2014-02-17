package support.mongo

import reactivemongo.core.commands.{Remove, Modify, Update}
import reactivemongo.bson._
import play.api.libs.json.{Writes, JsValue, JsObject}
import reactivemongo.api.Collection
import play.modules.reactivemongo.json.BSONFormats
import reactivemongo.api.gridfs.GridFS
import scala.Some

object FindAndModify {

  import reactivemongo.core.commands.{FindAndModify => RMFindAndModify}

  class Builder[C, Q, M, U, S, F](
    val collectionOption: Option[String] = None,
    val queryOption: Option[BSONDocument] = None,
    val modifyOption: Option[Modify] = None,
    val upsertOption: Option[Boolean] = None,
    val sortOption: Option[BSONDocument] = None,
    val fieldsOption: Option[BSONDocument] = None
    ) {

    private implicit val documentFormat = BSONFormats.BSONDocumentFormat

    private implicit val objectIdFormat = BSONFormats.BSONObjectIDFormat

    def collection(v: String) = new Builder[Any, Q, M, U, S, F](collectionOption = Some(v), queryOption, modifyOption, upsertOption, sortOption, fieldsOption)

    def collection[Col <: Collection](v: Col): Builder[Any, Q, M, U, S, F] = collection(v.name)

    def files[R[_], W[_]](v: GridFS[_, R, W]) = collection(v.files().name)

    def query(v: BSONDocument) = new Builder[C, Any, M, U, S, F](collectionOption, queryOption = Some(v), modifyOption, upsertOption, sortOption, fieldsOption)

    def query(v: JsObject): Builder[C, Any, M, U, S, F] = query(v.as[BSONDocument])

    def id(v: BSONValue): Builder[C, Any, M, U, S, F] = query(BSONDocument("_id" -> v))

    def id(v: JsValue): Builder[C, Any, M, U, S, F] = id(v.as[BSONObjectID])

    def modify(v: Modify) = new Builder[C, Q, Any, U, S, F](collectionOption, queryOption, modifyOption = Some(v), upsertOption, sortOption, fieldsOption)

    def update(updates: BSONDocument, fetchNewObject: Boolean) = modify(Update(updates, fetchNewObject))

    def update(updates: JsValue, fetchNewObject: Boolean): Builder[C, Q, Any, U, S, F] = update(updates.as[BSONDocument], fetchNewObject)

    def insert(updates: JsValue) = query(BSONDocument("_id" -> BSONNull)).update(updates, fetchNewObject = true).upsert

    def insert[T](updates: T)(implicit w: Writes[T]): Builder[C, Any, Any, Any, S, F] = insert(w.writes(updates))

    def remove = modify(Remove)

    def upsert = new Builder[C, Q, M, Any, S, F](collectionOption, queryOption, modifyOption, upsertOption = Some(true), sortOption, fieldsOption)

    def sort(v: BSONDocument) = new Builder[C, Q, M, U, Any, F](collectionOption, queryOption, modifyOption, upsertOption, sortOption = Some(v), fieldsOption)

    def sort(v: JsObject): Builder[C, Q, M, U, Any, F] = sort(v.as[BSONDocument])

    def fields(v: BSONDocument) = new Builder[C, Q, M, U, S, Any](collectionOption, queryOption, modifyOption, upsertOption, sortOption, fieldsOption = Some(v))

    def fields(v: JsObject): Builder[C, Q, M, U, S, Any] = fields(v.as[BSONDocument])

  }

  private val start = new Builder[Unit, Unit, Unit, Any, Any, Any]()

  def collection(v: String) = start.collection(v)

  def collection[Col <: Collection](v: Col) = start.collection(v)

  def files[R[_], W[_]](v: GridFS[_, R, W]) = start.files(v)

  def query(v: BSONDocument) = start.query(v)

  def query(v: JsObject) = start.query(v)

  def id(v: BSONValue) = start.id(v)

  def id(v: JsValue) = start.id(v)

  def modify(v: Modify) = start.modify(v)

  def update(updates: BSONDocument, fetchNewObject: Boolean) = start.update(updates, fetchNewObject)

  def update(updates: JsValue, fetchNewObject: Boolean) = start.update(updates, fetchNewObject)

  def insert(updates: JsValue) = start.insert(updates)

  def insert[T](updates: T)(implicit w: Writes[T]) = start.insert(updates)

  def remove = start.remove

  def upsert = start.upsert

  def sort(v: BSONDocument) = start.sort(v)

  def sort(v: JsObject) = start.sort(v)

  def fields(v: BSONDocument) = start.fields(v)

  def fields(v: JsObject) = start.fields(v)

  implicit def build(builder: Builder[Any, Any, Any, _, _, _]): RMFindAndModify = {
    RMFindAndModify(
      collection = builder.collectionOption.get,
      query = builder.queryOption.get,
      modify = builder.modifyOption.get,
      upsert = builder.upsertOption.getOrElse(false),
      sort = builder.sortOption,
      fields = builder.fieldsOption
    )
  }
}
