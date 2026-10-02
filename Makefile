.RECIPEPREFIX := >

CLUSTER_NAME := league-platform
KUBE_CONTEXT := k3d-$(CLUSTER_NAME)
CLUSTER_CONFIG := infra/local/k3d-config.yaml

.PHONY: cluster-up cluster-stop cluster-down cluster-status namespaces

cluster-up:
>k3d cluster start $(CLUSTER_NAME) || k3d cluster create --config $(CLUSTER_NAME)
>kubectl --context $(KUBE_CONTEXT) wait --for=condition=Ready nodes --all --timeout=180s
>$(MAKE) namespaces

namespaces:
>kubectl --context $(KUBE_CONTEXT) apply -f infra/local/namespaces.yaml

cluster-status:
>kubectl --context $(KUBE_CONTEXT) get nodes
>kubectl --context $(KUBE_CONTEXT) get namespaces -L environment

cluster-stop:
>k3d cluster-stop $(CLUSTER_NAME)

cluster-down:
>k3d cluster delete $(CLUSTER_NAME)


.PHONY: bootstrap bootstrap-check

bootstrap:
>kubectl --context $(KUBE_CONTEXT) wait --for=condition=Ready nodes --all --timeout=180s
>$(MAKE) namespaces
>terraform -chdir=infra/local/bootstrap init -input=false
>terraform -chdir=infra/local/bootstrap fmt -check
>terraform -chdir=infra/local/bootstrap validate
>terraform -chdir=infra/local/bootstrap plan -input=false -out=bootstrap.tfplan
>terraform -chdir=infra/local/bootstrap apply -input=false bootstrap.tfplan
>kubectl --context $(KUBE_CONTEXT) -n cert-manager rollout status deployment/cert-manager --timeout=180s
>kubectl --context $(KUBE_CONTEXT) -n cert-manager rollout status deployment/cert-manager-webhook --timeout=180s
>terraform -chdir=infra/local/tls init -input=false
>terraform -chdir=infra/local/tls fmt -check
>terraform -chdir=infra/local/tls validate
>terraform -chdir=infra/local/tls plan -input=false -out=tls.tfplan
>terraform -chdir=infra/local/tls apply -input=false tls.tfplan
>kubectl --context $(KUBE_CONTEXT) -n cert-manager wait --for=condition=Ready certificate/league-root-ca --timeout=180s
>kubectl --context $(KUBE_CONTEXT) wait --for=condition=Ready clusterissuer/league-local-ca --timeout=180s
>kubectl --context $(KUBE_CONTEXT) -n argocd wait --for=condition=Ready certificate/argocd-server-tls --timeout=180s
>$(MAKE) bootstrap-check

bootstrap-check:
>kubectl --context $(KUBE_CONTEXT) get nodes
>kubectl --context $(KUBE_CONTEXT) -n ingress-system get pods
>kubectl --context $(KUBE_CONTEXT) -n cert-manager get pods,certificates
>kubectl --context $(KUBE_CONTEXT) get clusterissuers
>kubectl --context $(KUBE_CONTEXT) -n argocd get pods,ingress,certificates


LOCALSTACK_DEV_DIR := infra/aws-localstack/envs/dev
LOCALSTACK_VPC_DIR := infra/aws-localstack/modules/vpc

.PHONY: local-dev-fmt local-dev-validate local-dev-plan

local-dev-fmt:
>terraform -chdir=$(LOCALSTACK_VPC_DIR) fmt
>terraform -chdir=$(LOCALSTACK_DEV_DIR) fmt

local-dev-validate: local-dev-fmt
>terraform -chdir=$(LOCALSTACK_DEV_DIR) validate

local-dev-plan: local-dev-validate
>env -u AWS_PROFILE -u AWS_DEFAULT_PROFILE -u AWS_SESSION_TOKEN AWS_ACCESS_KEY_ID=test AWS_SECRET_ACCESS_KEY=test AWS_EC2_METADATA_DISABLED=true terraform -chdir=$(LOCALSTACK_DEV_DIR) plan -lock-timeout=30s -out=dev.tfplan