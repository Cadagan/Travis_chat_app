# Entrega 3

**🎉 La documentacion solicitada se encuentra en [docs/](docs)**

---

# Entrega 2+

TODA NUESTRA INFO SE ENCUENTRA EN: https://github.com/Cadagan/Travis_chat_app

#  IIC2173 - Entrega 1 - Grupo 21

*  🎉 La documentacion solicitada se encuentra en [../docs/](docs)
*  🎉 El frontend se encuentra en [grupo21frontend.ml/](https://www.grupo21frontend.ml/) 
*  🎉 El backend se encuentra en [grupo21.ml/](https://www.grupo21.ml/)
  
# Requsitos 

### Requsitos Mínimos

<details>
  <summary>✔️ Backend</summary>

* ✔️ **RF1: (3p)** Se debe poder enviar mensajes y se debe registrar su timestamp. Estos mensajes deben aparecer en otro usuario, ya sea en tiempo real o refrescando la página. **El no cumplir este requisito completamente limita la nota a 3.9**
* ✔️ **RF2: (5p)** Se deben exponer endpoints HTTP que realicen el procesamiento y cómputo del chat para permitir desacoplar la aplicación. **El no cumplir este requisito completamente limita la nota a 3.9**

* ✔️ **RF3: (7p)** Establecer un AutoScalingGroup con una AMI de su instancia EC2 para lograr autoescalado direccionado desde un ELB (_Elastic Load Balancer_).
  *  ✔️ **(4p)** Debe estar implementado el Load Balancer
  * ️️✔️ **(3p)** Se debe añadir al header del request información sobre cuál instancia fue utilizada para manejar el request. Se debe señalar en el Readme cuál fue el header agregado.

* ✔️ **RF4: (2p)** El servidor debe tener un nombre de dominio de primer nivel (tech, me, tk, ml, ga, com, cl, etc).~~

* ✔️ **RF4: (3p)** El dominio debe estar asegurado por SSL con Let's Encrypt. No se pide *auto renew*. Tambien pueden usar el servicio de certificados de AWS para el ELB~~
    * ✔️ **(2p)** Debe tener SSL.
    * ✔️ **(1p)** Debe redirigir HTTP a HTTPS.
  
</details>

<details>
  <summary>✔️ Frontend</summary>

* ✔️ **RF5: (3p)** Utilizar un CDN para exponer los *assets* de su frontend. (ej. archivos estáticos, el mismo *frontend*, etc.). Para esto recomendamos fuertemente usar cloudfront en combinacion con S3.
* ✔️ **RF6: (7p)** Realizar una aplicación para el *frontend* que permita ejecutar llamados a los endpoints HTTP del *backend*.
    * ✔️ **(3p)** Debe hacer llamados al servidor correctamente.
    * ✔️ Elegir **1** de los siguientes. No debe ser una aplicación compleja en diseño. No pueden usar una aplicacion que haga rendering via template de los sitios web. Debe ser una app que funcione via endpoints REST
        * **(4p)** Hacer una aplicación móvil (ej. Flutter, ReactNative)
        * ✔️ **(4p)** Hacer una aplicación web (ej. ReactJS, Vue, Svelte)~~ Elegimos ReactJS :D
  
</details>

### Requsitos Opcionales

<details>
  <summary>✔️ Trabajo delegado </summary>

Se pide implementar al menos **3 casos de uso con distinto tipo de integración**.

* ✔️ 1.- Mediante una llamada web (AWS API Gateway) 
* ✔️ 2.- Mediante código incluyendo la librería (sdk) 
* 3.- Como evento a partir de una regla del AutoScalingGroup
*  4.- Mediante Eventbridge para eventos externos (NewRelic, Auth0 u otro)
* 5.- Cuando se esté haciendo un despliegue mediante CodeCommit 
* ✔️ 6.- Cuando se cree/modifique un documento a S3 
* ✔️ 7.- Amazon Comprehend 
* ✔️ 8.- Amazon Lambda Functions 

* ✔️ **RF: (5p)** Por cada uno de los 3 tipos de integración. Se implementaron y explicaron los 3. Se utilizó S3 para guardar imagenes, además de utilizar el tutorial para sentiment (censura de mensajes).
    * ✔️ **(3p)** Por la implementación.
    * ✔️ **(2p)** Por la documentación.
  
</details>

<details>
  <summary>✔️ Mensajes en tiempo real </summary>

* ✔️ **RF1: (5p)** Cuando se escriben mensajes en un chat/sala que el usuario está viendo, se debe reflejar dicha acción sin que éste deba refrescar su aplicación. 
* ✔️ **RF2: (5p)** Independientemente si el usuario está conectado o no, si es nombrado con @ o # se le debe enviar una notificación (al menos crear un servicio que diga que lo hace, servicio que imprime "se está enviando un correo") -> Para esto se creó un sistema de register/login con passportjs y express-sessions. El correo no se manda pero sí está vinculado al correo del usuario (y si el usuario a quien mencionaron está conectado, le llegará una notificación).
* ✔️ **RF3: (5p)** Debe documentar los mecanismos utilizados para cada uno de los puntos anteriores indicando sus limitaciones/restricciones. Esto se encuentra en docs/Readme.Md :D
* 
</details>

### Bonus

<details>
  <summary>✔️/ ❌ Caché </summary>

Para esta sección variable la idea es implementar una capa de Caché para almacenar información y reducir la carga en el sistema. Para almacenar información para la aplicación recomendamos el uso de **Redis**, así como recomendamos Memcached para fragmentos de HTML o respuestas de cara al cliente. 

* ✔️ **RF1: (4p)** Levantar la infraestructura necesaria de caché. Se puede montar en otra máquina o usando el servicios administrado por AWS. Se debe indicar como funciona en local y en producción. 
* **RF2: (6p)** Utilizar la herramienta seleccionada de caché para almacenar las información para al menos 2 casos de uso. Por ejemplo las salas y sus últimos mensajes o credenciales de acceso (login). 
    * **Restricción** Por cada caso de uso debe utilizar alguna configuración distinta (reglas de entrada FIFO/LIFO, estructura de datos o bien el uso de reglas de expiración)
* **RF3: (5p)** Documentar y explicar la selección de la tecnología y su implementación en el sistema. Responder a preguntas como: "¿por qué se usó el FIFO/LRU o almacenar un hash/list/array?" para cada caso de uso implementado. 
  
</details>
