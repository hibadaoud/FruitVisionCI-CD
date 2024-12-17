#  **FruitVision: AI-based Application for Counting and Classification** 

## **Table of Contents**
- [📌 Project Overview](#-project-overview)
- [🔑 Key Objectives](#key-objectives)
- [🚀 Technologies Used](#technologies-used)
- [🏛️ Architecture](#architecture)
- [📜 Data](#-data)
- [🧠 Model](#-model)
   - [Data Annotation: Transformation to COCO Format](#️-data-annotation-transformation-to-coco-format)
   - [Model Architecture](#️-model-architecture)
- [🔗 Model Integration](#-model-integration) 
- [🐳 Dockerization](#-Dockerization)  
- [☁️ Deployment Using Terraform](#deployment-using-terraform)
- [📱 Results: Application interfaces](#results)
- [🔧 Setup and usage](#setup-and-usage)
- [🔮 Future Considerations](#-future-considerations)
- [🤝 Contributing](#-contributing)
- [👨‍💻 Project By](#project-by)

---

## 📌 Project Overview  

### 📚 Background:
This project, developed by Hiba Daoud and Farah Elloumi as part of their end-of-year work at the Higher School of Communications in Tunis (SUP'COM), aims to **count and classify fruits on trees** to assist farmers in **yield estimation** while maintaining a **detailed history** of the classified fruits for improved tracking and management.

### 🌟 Project Scope:

The project is divided into **three main parts**:
1. **Model Development**: Building a deep learning computer vision model for processing, detecting, classifying, and counting fruits on trees.
2. **Application Development**: Integrating the model into an application, with a backend and a persistent database for seamless functionality.
3. **Deployment and Scalability**: Packaging the application into containers, orchestrating services for seamless operation, and automating infrastructure deployment to ensure scalability, consistency, and efficient resource management.


## 🔑 Key Objectives

- 🖼️ **User-Friendly Interface**  
   Develop an **intuitive and easy-to-use application** that allows farmers to:
   - Capture photos of their trees.  
   - View the processed results, including fruit detection, classification, and counts.  

- 🧠 **Deep Learning Integration**  
   Incorporate a **computer vision model** for:  
   - Image processing.  
   - Accurate detection, classification, and counting of fruits on trees.  

- 📊 **Data Persistence**  
   Implement a **MongoDB database** to:  
   - Store the history of fruit yield estimations.  
   - Enable efficient tracking and analysis for crop management.  

- 🔗 **Seamless Integration**  
   Ensure smooth and real-time integration between the following components:  
   - **Deep Learning Model**  
   - **Application Frontend** (for user interaction).  
   - **Backend Database** (for data storage and retrieval).  

- 🐳 **Containerization and Orchestration**  
   Package the application components (backend, model, and database) into lightweight **containers** to ensure portability. Use an **Docker compose** an orchestration tool to manage and run these services together seamlessly.

- ☁️ **Infrastructure Automation**  
   Automate the provisioning and deployment of the system infrastructure to the cloud, ensuring consistency, scalability, and simplified resource management.


## 🚀 Technologies Used

| Component            | Technology                          |
|-----------------------|-------------------------------------|
| **Model**            | Detectron2, Faster R-CNN |
| **Backend API**      | FastAPI                             |
| **Frontend**         | Flutter                             |
| **Backend**          | Express.js, MongoDB                |
| **Authentication**   | Firebase Auth                      |
| **Containerization** | Docker                              |
| **Orchestration**    | Docker Compose                      |
| **Infrastructure**   | Terraform                           |

## 🏛️ Architecture


## 📜 Data:
- We collected **194 images** spanning 6 fruit categories: **Apples, Strawberries, Kiwis, Lemons, Oranges**, and an **Unknown** type.

- Each image was annotated using **LabelMe** to generate individual JSON files.  
   - These annotations include:
     - Bounding boxes.
     - Object categories.

- The images are in `./dataset/`.  

## 🧠 Model:
The fruit detection model is built using **Faster R-CNN** with the [**Detectron2**](https://github.com/facebookresearch/detectron2) library.

### 🗂️ **Data Annotation: Transformation to COCO Format**

To facilitate the integration of annotated data with the model, we converted individual **LabelMe JSON files** into a single **COCO JSON file** useful for object detection and segmentation tasks.

#### **Process**   

1. **Transformation**:  
   - The **labelme2coco** tool was used to combine all LabelMe JSON files  into a single **COCO JSON file**.  

2. **COCO JSON Structure**:  
   The resulting COCO file contains:  
   - **Images**: The paths and metadata of all annotated images.  
   - **Annotations**: Bounding boxes, segmentation masks, and associated categories.  
   - **Categories**: Labels for the detected objects (e.g., Apples, Strawberries, etc.).

### 🧠 **Model Architecture**

We implemented the **Faster R-CNN** model with a **ResNet-50** backbone and **Feature Pyramid Network (FPN)** for fruit detection and classification.

#### **1. Feature Extraction and Multi-Scale Representation**
<div align="center">
    <img src="./images/Feature_Extraction_and_FPN.png" alt="Fruit Detection and Classification Process">
</div>

- **Backbone - ResNet-50**  
   - Extracts essential features from the input images using convolutional layers.  
   - At each layer, the image resolution is divided by 2, allowing for a detailed analysis at multiple scales.  

-  **Feature Pyramid Network (FPN)**  
   - Enhances the feature maps generated by ResNet-50 by combining features at different resolutions.  
   - Produces **multi-scale feature maps** that allow the model to detect fruits of various sizes effectively.  

#### **2. Fruit Detection and Classification Process**
<div align="center">
    <img src="./images/Fruit_Detection_and_Classification_Process.png" alt="Fruit Detection and Classification Process" width="70%">
</div>

1. **Region Proposal Network (RPN)**:  
   - The FPN-generated feature maps are used to propose potential regions (RoIs) where fruits might be located.  
   - Each proposal is assigned an **objectiveness score** to filter irrelevant regions.  

2. **RoI Pooling**:  
   - Valid regions are normalized and resized to a fixed size.  
   - This ensures consistent input for further processing.

3. **Classification and Refinement**:  
   - Fully connected layers analyze each **RoI** to:  
     - Determine the **class** of the detected object (e.g., Apple, Strawberry).  
     - Refine the **bounding box** around the fruit for precise localization.

4. **Final Output**:  
   - The model outputs an image annotated with **bounding boxes** around each detected fruit and its corresponding classification label.  
   - The total number of fruits is determined by counting the bounding boxes.


## 🔗 Model Integration 
The model is integrated into the application via **FastAPI**:
 **Model Path**:  
   The trained model weights are stored in a specific directory `./detectron2/model_path/model_final.pth`.  
   - The path is loaded during FastAPI server startup to ensure quick model inference.  
- **Model Inference**: FastAPI serves as the backend API to perform predictions.
- **Endpoints**:
   - **/analyze**: Accepts input images for fruit detection.
   - **/get_analyzed_image**: Retrieves processed images with bounding boxes.
- **Data Flow**:
   - **Frontend**: Flutter app sends images to FastAPI.
   - **Backend**: FastAPI processes the image using the trained model and returns results.
   - **History Storage**: Results are stored in **MongoDB**.

## 🛠️ **Node.js Express Backend**

The **backend** is developed using **Node.js** with the **Express.js framework**. It connects to a MongoDB database to handle fruit history data and provides the following endpoints:

### **API Endpoints**

1. **`GET/POST /nodejs/api/history`**  
   - Retrieve all histories or create a new history.  

2. **`GET /nodejs/api/history/os`**  
   - Fetch the **OS hostname** where the service is running.  

3. **`GET /nodejs/api/history/live`**  
   - Check if the server is live.

### **Running the Backend Alone**

To run the backend independently:

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create a **.env** file and define the following variables:
  ```.env
   MONGO_BASE_URI=<your_mongodb_url>
   DB_NAME=fruitvision
   MONGO_USERNAME=<your_mongodb_username>
   MONGO_PASSWORD=<your_mongodb_password>
   ```
3. Start the server:
  ```bash
   node server.js
   ```
4. Access the API:

  - http://localhost:5000/nodejs/api/history (Main endpoint).

> [!NOTE]
> Note that this step only applies if you would like to run the backend independently and use your own mongodatabase. We define one in the docker compose file

## 🐳 Dockerization

The project is fully containerized with **Docker** to ensure portability and scalability. Two Docker images are built and pushed to Docker Hub:

- **`hiba25/backend`**: For the Node.js backend.  
- **`hiba25/modele`**: For the FastAPI model.

### **Docker Compose Configuration**

A `docker-compose.yml` file is provided to orchestrate the services. It includes:

1. **MongoDB**:  
   - Database service for storing history data.  
   - **Ports**: `27018:27017`  
   - **Data Persistence**: Managed using volumes.

2. **Mongo Express**:  
   - Web-based UI for MongoDB.  
   - **Accessible at**: `http://localhost:8081`

3. **Backend Service**:  
   - Node.js Express API for handling history endpoints.  
   - **Ports**: `5000:5000`

4. **Model Service**:  
   - FastAPI service hosting the deep learning model.  
   - **Ports**: `8000:8000`  
   - **Swagger UI**: Accessible at `http://your_IP:8000/docs`


## ☁️ Deployment Using Terraform

### **Goal**
The goal of using **Terraform** is to automate and provision the infrastructure required for deploying the **FruitVision application**. Terraform ensures consistency, scalability, and seamless management of cloud resources.

Using **Terraform**, we successfully automated the deployment of a Virtual Machine and networking configurations. This ensured a scalable and secure infrastructure for our application, ready for deployment of services like the Node.js backend, Mongo database and FastAPI model.


1. **Infrastructure Definition**:  
   - We defined and automated the infrastructure using Terraform files (`main.tf`, `network.tf`, `vm-provisioner.tf`).
   - Resources include:
     - **Virtual Machines (VMs)** for running services.
     - **Networking** configurations (VNet, Subnet, Security Groups) to manage communication.
     - Public IP setup for external access.

2. **Docker Compose Integration**:  
   - The **public IP** of the deployed VM is dynamically updated in the **Docker Compose file** to configure the `BASE_URL` for running the FastAPI model.

3. **SSH Key Configuration**:  
   - We set up **SSH key-pairs** to enable secure access to the provisioned virtual machines.

4. **State and Outputs**:  
   - Terraform outputs the necessary details like the **Public IP** of the deployed instances for quick access.

## 📱Results: FruitVision Application Interfaces
<br/>
<div style="display:flex;flex-direction:column;justify-content:canter;" align="center">
    <div>  
        <img style="padding:10px;" src="https://github.com/hibadaoud/FruitVision/assets/153644549/a14a6abe-f49c-403e-a9b1-225616b11194" alt="pic1" height="400">
<!--         <img style="padding:10px;" src="https://github.com/hibadaoud/FruitVision/assets/153644549/86dc13e8-df93-4ee0-8b74-7595cbae113b" alt="Login and signup" height="400">
        <img style="padding:10px;" src="https://github.com/hibadaoud/FruitVision/assets/153644549/b3516cc3-544f-4091-83bf-4038d0fc029b" alt="settings" height="400">   -->
    </div>
    <br/>
    <div>
        <img style="padding:10px;" src="https://github.com/hibadaoud/FruitVision/assets/153644549/b0d97f9c-db2d-4660-969b-60bf6aa8744c" alt="pic2" height="400">    
<!--         <img style="padding:10px;" src="https://github.com/hibadaoud/FruitVision/assets/153644549/c69c97bb-d3bd-4dc2-a207-bc1625fd27cd" alt="Prediction History" height="400">
    </div> -->
    <br/>
    <div>
        <img style="padding:10px;" src="https://github.com/hibadaoud/FruitVision/assets/153644549/678e4631-0f33-4211-8843-f0915ec5c632" alt="pic3" height="400">    
<!--         <img style="padding:10px;" src="https://github.com/hibadaoud/FruitVision/assets/153644549/c69c97bb-d3bd-4dc2-a207-bc1625fd27cd" alt="Prediction History" height="400">
    </div> -->
    <br/>
    <div>
        <img style="padding:10px;" src="https://github.com/hibadaoud/FruitVision/assets/153644549/605465c4-cb6e-4d1e-8d78-e3db9b27bfde" alt="pic3" height="400">    
<!--         <img style="padding:10px;" src="https://github.com/hibadaoud/FruitVision/assets/153644549/c69c97bb-d3bd-4dc2-a207-bc1625fd27cd" alt="Prediction History" height="400">
    </div> -->
    <br/>
</div>

## 🔧 Setup and usage

### Prerequisites
- Docker
- Flutter development environment (e.g., Android Studio)
- Terraform
- Azure account to build and manage the virtual machine via terraform

### Steps to Run
1. **Clone the repository**:
   ```bash
   git clone <repo-link>
   cd project-directory
   ```
2. **Run Docker Services**:
  - Update **BASE_URL** in docker-compose.yml with **your IP**.
  - Start services:
    ```bash
      docker-compose up -d
    ```
3. **Configure Flutter Application**:
  - Navigate to the Flutter root directory and open it with your Flutter development environment
  - Create a .env file:
    ```env
    MODEL_API=http://your_IP:8000
    HISTORY_API=http://your_IP:5000/nodejs
    ```
4. **Install Flutter Dependencies**:
  ```bash
  flutter pub get
  ```
5. **Run the Flutter Application**:
  - Connect a device/emulator.
  - Start the app:
    ```bash
    flutter run
    ```
### Useful URLs
- FastAPI Endpoints (Model): http://your_IP:8000/docs
- Node.js API (Backend): http://your_IP:5000/nodejs/api/history
- Mongo Express: http://your_IP:8081

## Microsoft Azure Terraform Setup tp deploy a VM
 1. **Pre-requisites**:
   - Install the **Azure CLI** and authenticate:
     ```bash
     az login
     ```

   - Generate an SSH key-pair (if not already created):
     ```bash
     ssh-keygen
     ```

   - Export the public key as an environment variable:
     - **Linux**:
       ```bash
       export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_rsa.pub)"
       ```
     - **Windows**:
       ```bash
       $env:TF_VAR_ssh_public_key = Get-Content -Raw -Path "C:\Users\<YourUsername>\.ssh\id_rsa.pub"
       ```

2. **Update Configuration**:
   - Modify the `variables.tf` file to include your **IP address** for permitted access.

3. **Initialize Terraform**:
   - Navigate to the Terraform project directory and initialize Terraform:
     ```bash
     terraform init
     ```

4. **Apply Configuration**:
   - Provision the resources by running:
     ```bash
     terraform apply
     ```

5. **Deploy Services**:
   - SSH into the virtual machine:
     ```bash
     ssh -i ~/.ssh/id_rsa adminuser@<instance_public_ip>
     ```

   - Run the Docker Compose file:
     ```bash
     docker-compose up -d
     ```

6. **Update Flutter Configuration**:
   - After deploying with Terraform, update the `.env` file in the **Flutter project** with the new `public_IP`:
     ```env
     MODEL_API=http://<public_IP>:8000
     HISTORY_API=http://<public_IP>:5000/nodejs
     ```

8. **Configure and Run Flutter Application**:
   - Navigate to the Flutter root directory and install dependencies:
     ```bash
     flutter pub get
     ```

   - Connect your device/emulator and run the app:
     ```bash
     flutter run
     ```

9. **Access Deployed Services**:
   - **FastAPI Swagger UI**: `http://<public_IP>:8000/docs`  
   - **Backend API**: `http://<public_IP>:5000/nodejs/api/history`  
   



