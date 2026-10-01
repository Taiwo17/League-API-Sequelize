resource "helm_release" "traefik" {

  name             = "traefik"
  repository       = "https://traefik.github.io/charts"
  chart            = "traefik"
  version          = "41.6.0"
  namespace        = "ingress-system"
  create_namespace = true

  atomic          = true
  cleanup_on_fail = true
  wait            = true
  timeout         = 600

  values = [file("${path.module}/traefik-values.yaml")]
}
