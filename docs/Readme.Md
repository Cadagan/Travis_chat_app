# Documentación 

El presente README.md contiene la documentación solicitada para la Entrega 1.

## Documentación Headers Load Balancer

Se añadió el header current instance en las consultas al api.

## Documentación Trabajo delegado 

A continuación se encuentra documentado los 5 distintos casos de uso.

### 1. Amazon Simple Storage Service (Amazon S3)

Para la distribución de fotos de perfil en el Chat, se utilizó *Amazon S3*. 

**Justificación de uso**

La utilización de *Amazon S3* se justifica ya que de esta forma tendremos acceso a la infraestructura de Amazon de guardado de datos y archivos, para poder acceder a ellos de forma rápida independientemente de nuestra ubicación. Además, de esta forma no guardamos este contenido dentro de nuestra misma base de datos.

**Documentación de implementación**

Su implementación incluye primero tener que crear un bucket de S3 en una de las regiones de AWS para después utilizar los interfaces de programación de aplicaciones *(API)* dados para poder consumirlos dentro de la app.


### 2. Amazon Comprehend 

Para proveer censura en el chat, se utiliza procesamiento de lenguaje natural mediante *Amazon Comprehend*.

**Justificación de uso**

Se logra censurar mensajes en el chat cuando su connotación es negativa sin experiencia previa en procesamiento de lenguaje natural, ni conocimiento del lenguaje del mensaje (dentro de los disponibles del servicio).

**Documentación de implementación**

Podemos analizar el sentimiento de un mensaje enviado por alguno de los usuarios utilizando *POST requests* hacia *Amazon Comprehend* que recibe el contenido del mensaje, determina el lenguaje dominante, para luego analizar y responden el *sentiment* de dicho mensaje. 
Se tomó la decisión de censurar el chat con "****" En casos en donde el sentimiento del mensaje sea negativo.


### 3. AWS Lambda (Lambda Functions) 

Se utiliza en conjunto para responder mediante *triggers* junto a otros servicios de Amazon.

**Justificación de uso**

Permite poder ejecutar los servicios a utilizar sin solicitar un servidor permanente, sino solo cuando es necesario su uso.

**Documentación de implementación**

Para el caso de la aplicación, la implementación anteriormente mencionada de *Amazon Comprehend* es llamada mediante *Lambda* cuando existe una solicitud.


### 4. Amazon API Gateway

Recibe los *POST requests* con los mensajes de chat, para ser analizados por *Amazon Comprehend* mediante la *Lambda function* definida para esto.

**Justificación de uso**

Permite la comunicación entre los mensajes enviados en la aplicación y el servicio que los analiza de forma rápida.

**Documentación de implementación**

Cada uno de los mensajes de chat son enviados para ser analizados. Esto, como se mencionó anteriormente, se realiza mediante *requests POST* que son recibidos inicialmente por *Amazon API Gateway.*


### 5. AWS SDK

Conecta el código con *AWS* de forma rápida.

**Justificación de uso**

Permite facilitar la utilización de los servicios web de Amazon, sin tener que implementar objetos nuevos constantemente.

**Documentación de implementación**

Se utiliza el kit de desarrollo de software *aws-sdk* que proporciona objetos *JavaScript* para agilizar la conexión del código con los servicios de AWS.


## Documentación Mensajes en tiempo Real 

Los mensajes se mandan a través de socket.io. Una vez que un usuario se conecta a la sala, se establece una conexión de websockets entre el servidor y el usuario.  Luego al escribir un mensaje al backend, este lo guarda en base de datos y posteriormente lo envia a todos los frontends que tiene conectados en ese momento.  Los clientes al recibir estos mensajes simplemente lo agregan a su lista de mensajes.

Por otro lado, para hacer la notificación de menciones, una vez el mensaje llega al backend, este revisa si tiene un @, a través del cual consigue el usuario escrito justo adelante, obtiene el correo asociado a dicho usuario desde la base de datos y prepara para enviar el correo.

### 1. Limitaciones:

Una posible limitación de este mecanismo sería que el usuario tiene que estar conectado a una sala para que le aparezca la mención (estando conectado). El correo le va a llegar de cualquier manera, pero las menciones en vivo en la pagina solo se muestran dentro de una sala.

Por otro lado, actualmente por como se revisa el usuario en caso que no se escriba ningun mensaje luego de la mención, el usuario no se encontrará. Ya que se busca un espacio en el mensaje. 

Esto se puede cambiar para la siguiente entrega sin problemas.

## Documentación Caché

Se utiliza Amazon ElastiCache para hostear una instancia de Redis, sin embargo la conexion con el codigo no fue completamente implementada.