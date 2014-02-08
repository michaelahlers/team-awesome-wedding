name := "team-awesome-wedding"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  "org.reactivemongo" %% "play2-reactivemongo" % "0.10.2",
  "org.webjars" % "angularjs" % "1.2.11",
  "org.webjars" % "bootstrap" % "3.1.0"
)

play.Project.playScalaSettings

routesImport += "support.Binders._"
