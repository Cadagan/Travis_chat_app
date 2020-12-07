# IAAC

Para el desarrollo de esta parte, utilizamos el software de `Terraform` para facilitar el proceso.

[Puedes descargar este softeware en este link](https://www.terraform.io/downloads.html)


Basicamente para inicializar se debe ejecutar

`terraform init`

`terraform plan`

Y luego solo basta correr el codigo de [example.tf](terraform/example.tf) escribiendo:

`terraform apply`

Con estos simples pasos, al correr el codigo del archivo **.tf**, la infreastructura necesaria ya estará montada en AWS, faltando solamente acceder al servidor, pullear el codigo y dejar la applicacion corriendo.

La infraestructura que se puede encontrar en el archivo **.tf** es la siguiente:
* Instancia de EC2
* Security Group para EC2
* Configuracion de lanzamiento
* AutoScailing Group
* Security Group para ELB (Application type)
* Confiuguracones necesarias

Nota: El archivo "variable.rf" son solo variables necesarias para el correcto funcionamiento de Terraform. Cabe notar que deben colocar en la variable `public_key_path` la ruta para acceder al archivo **.pem** necesario, y el resto de configuraciones si se queire replicar en un escenario diferente.

## Espacio de mejora

Cabe destacar que con terraform, podemos ocupar recursos no solo de AWS, sino que de muchos servicios distintos (los cuales se pueden ver en [esta lista](https://registry.terraform.io/search/providers?namespace=hashicorp))

Esto abre la puerta a un mundo de posibilidades distintas, cada una segun una combinacion de diferentes servicios. Esto sin duda refleja el espacio de mejora tremendo que podriamos aplicar a nuestra aplicacion, ademas de poder ocupar la misma infrestructura para diferentes aplicaciones.

Todo esto, ademas de lo comentado en el "Hint" de esta entrega, que sin duda facilita la replicacion de la infraestructura necesaria para poder tener un ambiente de staging y otro para production. 