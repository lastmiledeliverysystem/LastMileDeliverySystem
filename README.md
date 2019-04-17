
#`LMD E-commerce System`

***

## Authentication

Authentication using jwt.

- `POST /api/customers` register a new customer [Customers Api](#customers-api)
- `POST /api/vendors`   register a new vendor [Vendors Api](#vendors-api)
- `POST /api/auth`  Login to your account 
- `GET /api/users/me` Authorize user


 

### Login to your account 

#### Request Header


~~~JavaScript
Content-Type = application/json
~~~

 

#### Request Body


~~~JavaScript
{
	"email":"mkassim@gmail.com",
	"password":"Kassim@1234"
}
~~~

 

#### Response

~~~JavaScript
response with the jwt Token
~~~

 

### Authorize user

#### Request Header


~~~JavaScript
Content-Type = application/json
x-auth-token = `jwt access token`
~~~


 

#### Response

~~~JavaScript
 false error if user authorized
~~~

***

## Customers Api

### Get Customers

```
GET /api/customers
```

return Array of customers objects.

~~~JavaScript
[
    {
        "_id": "5cb0963bd8d27a37a4072790",
        "fName": "mark",
        "lName": "3abslam",
        "phone": 123456789,
        "birthDate": "1996-01-10T22:00:00.000Z",
        "imageURL": "url",
        "address": [
            {
                "_id": "5cb0963bd8d27a37a4072791",
                "address1": "egypt",
                "address2": "tanta",
                "state": "tanta",
                "city": "ta",
                "zip": "t"
            }
        ],
    },...
]
~~~

### Create new Customer
```
POST /api/customers
```

 

#### Request Header


~~~JavaScript
Content-Type = application/json
~~~

 
#### Request Body


~~~JavaScript
{
	"address": {
        "address1": "egypt",
        "address2": "tanta",
        "state": "tanta",
        "city": "ta",
        "zip": "t"
    },
    "fName":"mark",
    "lName":"3abslam",
    "phone":"01199999999",
    "birthDate":"1-11-1996",
    "email":"mark@gmail.com",
    "password":"Mark@1234",
    "imageURL":"https://via.placeholder.com/350x150"
}
~~~

 

#### Response


return Array of customers objects.

~~~JavaScript
response with the created customer
~~~

 


### Delete Customer
```
DELETE /api/customers/:id
```

 

#### Request Header


~~~JavaScript
Content-Type = application/json
~~~

 

#### Response


return Array of customers objects.

~~~JavaScript
response with the deleted customer
~~~

***


## Vendors API

- `GET /api/vendors/`
- `GET /api/vendors/:id`
- `POST /api/vendors/`
- `DELETE /api/vendors/:id`


 

###Create Vendor
#### Request Header


~~~JavaScript
Content-Type = application/json
~~~

 

#### Request Body


~~~JavaScript
{
	    "address": {
        "address1": "egypt",
        "address2": "tanta",
        "state": "tanta",
        "city": "ta",
        "zip": "t"
    },
    "name": "Maha",
    "category": "food",
    "phone": 1234,
    "vendorType": "FOOD",
    "imageURL": "dfdsf",
    "email":"maha@maha.com",
    "password":"Maha@1234"
}
~~~

 

#### Response

~~~JavaScript
response with the created customer
~~~

 
***

## Products List API

Every vendor has his own list of products 

- `GET /api/products`  return all the lists of products for all vendors
- `GET /api/products/:id` return products list of the specified vendor
- `POST /api/products`
- `DELETE /api/products/:id` delete products list of the specified vendor


 

### Create Product list

#### Request Header


~~~JavaScript
Content-Type = application/json
~~~

 

#### Request Body


~~~JavaScript
{ "vendorProducts": [{
   "name": "tshirt",
    "category": "ayhaga",
    "description": "good quality",
    "rate": "5",
    "price": "100",
    "specs": "pplister",
    "quantity": "10",
    "unit": "LE",
    "sku": "asd55",
    "barCode": "sadsad",
    "productId": "12",
    "options": {
      "image": "https://i.pinimg.com/originals/35/9e/97/359e972e525a703306e909e642e077c8.jpg",
      "color": "Yellow",
      "size": "21"}
    },...]
}
~~~

 

#### Response

~~~JavaScript
response with the created product list
~~~

 