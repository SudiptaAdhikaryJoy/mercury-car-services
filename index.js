const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e9cyj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run(){
  try{
    await client.connect();
    const database = client.db('mercury_car_services');
    const serviceAppointment = database.collection('service_appointment');
    // get api
    app.get('/service_appointment', async(req, res)=>{
      const email = req.query.email;
      const date = new Date(req.query.date).toLocaleString();
      
      const query = {email: email, date: date};
      const cursor = serviceAppointment.find(query);
      const appointments = await cursor.toArray();
      res.json(appointments);
    })
    // post api
    app.post('/service_appointment', async(req, res) =>{
      const appointment = req.body;
      const result = await serviceAppointment.insertOne(appointment);
      console.log(result);
      res.json(result);
    })
  }
  finally{
    // await client.close();
  }

}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('hello world')
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
