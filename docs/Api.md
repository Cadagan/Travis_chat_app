# Api documentación

---
#### URL :`${BACKEND_HOST}/rooms`
#### GET:

#### Success Response
```
Array of rooms.
```
---
#### URL :`${BACKEND_HOST}/rooms/new`
#### POST : 
|Param |Description|
|-----|--------|
|room| room params |
    
**Example**:
 ```
{
    method: 'POST',
    body: JSON.stringify(data),
    headers: 
    {
      'Content-Type': 'application/json'
    }
}
``` 
#### Success Response
**Example**:
 ```
{
    "success": true
}
``` 
---
#### URL :`${BACKEND_HOST}/messages/${this.sessionData.roomId}/before/${amount}`
#### POST : 
    
**Example**:
 ```
{
    method: 'POST',
    body: JSON.stringify(data),
    headers: 
    {
      'Content-Type': 'application/json'
    }
}
``` 
#### Success Response
``` 
Array of `amount` messages.
``` 
---

#### URL :`${BACKEND_HOST}/messages/${this.sessionData.roomId}/latest/${amount}`
#### GET:

#### Success Response
```
Array of latest `amount` of messages.
```
---
#### URL :`${BACKEND_HOST}/messages/new`
#### POST : 
|Param |Description|
|-----|--------|
|message| message params |
    
**Example**:
 ```
{
    method: 'POST',
    body: JSON.stringify(data),
    headers: 
    {
      'Content-Type': 'application/json'
    }
}
``` 
#### Success Response
**Example**:
 ```
{
    "success": true
}
```
---
#### URL :`${BACKEND_HOST}/rooms/${this.sessionData.roomId}/image`
#### POST : 
|Param |Description|
|-----|--------|
|roomImage| Image of room |
    
**Example**:
 ```
{
    method: 'POST',
    body: JSON.stringify(data),
    headers: 
    {
      'Content-Type': 'application/json'
    }
}
``` 
#### Success Response
**Example**:
 ```
{
    "success": true
}
``` 