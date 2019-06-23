
const axios = require('axios');


const vendors = ['Computer', 'Beauty', 'Baby', 'Pet', 'Mobile', 'Footwear', 'Bags', 'Kitchen', 'Health', 'Food'];

// for (let i = 0; i < vendors.length; i++) {

//   const vendorData = {
//     name: `${vendors[i]} vendors`,
//     category: `${vendors[i]}`,
//     phone: 123456789,
//     vendorType: `${vendors[i]}`,
//     imageURL: 'Picture',
//     email: `${vendors[i]}@gmail.com`,
//     password: `@${vendors[i]}1`
//   };
//   console.log(vendorData);
//   axios.post('http://localhost:8000/api/vendors', vendorData)
//     .then((res) => {
//       console.log('plapla', res);
//     }).catch((error) => {
//       console.log(error.response);
//     });
// }

const vendorsData = []
const data={}
axios.get('http://localhost:8000/api/vendors')
    .then((res) => {
      // console.log(res.data);
      const data= res.data;
      for (let i = 0; i < 10; i++){
        const x = {id:data[i]._id, category:data[i].category};
       vendorsData.push(x);
        // vendorData.push({id: data[i]._id, category: data[i].category})
        // console.log({id: res.data[i]._id, category: res.data[i].category})
        // console.log(x);
      }
      console.log(vendorsData);
    }).catch((error) => {
      console.log(error.response);
    });

