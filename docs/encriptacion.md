## Encriptación (25%) (15p)

### Salas de chat privadas

Cada vez que un usuario genera una nueva sala tiene la opcion de establecerla como privada y generar una contrasena, la cual es almacenada en la base de datos. 

Cada vez que un nuevo usuario quiere ingresar a dicha sala debe ingresar la contrasena, la cual es validada internamente. De esta forma, se consigue que la unica forma de acceso a dicha sala sea con el permiso del creador de ella, quien le otorga la contrasena solo a los usuarios que el desee.

### Encriptación end-to-end en mensajes de un grupo.

Para la presente entrega decidimos utilizar encryptacion asymetrica, generando que cada persona tenga una key publica y una privada. De esta forma al enviar un mensaje, se comparte la clave publica, y se encrypta el mensaje con la clave privada utilizando el protocolo de PGP.

En terminos tecnicos, el usuario al conectarse a una sala genera su propia clave publica, enviandola a todos los otros miembros de la sala. Dichos usuarios almacenan la llave entregada por parte del nuevo usuario y responden con sus propias llaves publicas. De esta forma, todos los usuarios concurrentes tienen las llaves publicas de cada uno de los otros usuarios.

A la hora de enviar un mensaje publico, se debe conciderar encriptar con dicho string con cada una de las llaves publicas de los otros usuarios que existen en la sala, quienes al recibirlo proceden a desencriptarlo con sus propias llaves pirvadas.