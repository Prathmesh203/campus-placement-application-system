const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');
const driveRoutes = require('./src/routes/drive.routes');
const applicationRoutes = require('./src/routes/application.routes');
const adminRoutes = require('./src/routes/admin.routes');
const studentRoutes = require('./src/routes/student.routes');
const connectDb = require("./src/db/db");
const app = express();

app.use(cors({
     origin: 'http://localhost:5173', // Update with your frontend URL
}));
app.get('/', (req, res) => {
     res.send("server is running on port 3000.");
})
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

connectDb().then(() => {
     app.listen(3000, () => {
          console.log("server is running.");
     })
}).catch((err) => {
     console.log("failed to connect server.", err.message);

});
