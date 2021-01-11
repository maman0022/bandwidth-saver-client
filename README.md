# Bandwidth Saver
Live Link: https://bandwidth-saver.vercel.app  
  
## Summary  
This is the client side of my full-stack app. This app allows users to upload any public link on the internet directly to their Dropbox or OneDrive accounts. There is no need to download the file first.  

![main page](https://i.ibb.co/qBvBSyZ/main.png)  
  
Users can try the app without registering or create an account. Free users are limited to 2 uploads per hour. Registered users are allowed 5 uploads per hour.  

![upload page](https://i.ibb.co/5s9C2DL/upload.png)  
  
The app uses the OneDrive and Dropbox SDKs so users can select the folder they want to save the file into. 
  
![dropbox page](https://i.ibb.co/FBqrm5k/db.png)  
![onedrive page](https://i.ibb.co/L9HSsy0/od.png)  
  
## Tech Stack  
This is a React based app built using functional components and hooks, with React Router handling navigation. This app was created with "create-react-app" node module so it contains all dependencies associated with that. Testing is done with Jest and the React testing library. The OneDrive and Dropbox Javascript SDKs are used to allow the user to select the folder and also handles the uploading of the file. FingerprintJS is used to enforce the upload quota limit. ReCAPTCHA is used to prevent automatic account creation.   

The back-end is hosted on Heroku and uses PostgreSQL as the persistence layer. More information on the back-end can be found here - https://github.com/maman0022/bandwidth-saver-server.