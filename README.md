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
- [Setup and Deployment](#setup-and-deployment)
- [Results](#results)
- [Challenges and Future Improvements](#challenges-and-future-improvements)

---

## 📌 Project Overview  

### 📚 Background:
This project, developed by Hiba Daoud and Farah Elloumi as part of their end-of-year work at the Higher School of Communications in Tunis (SUP'COM), aims to **count and classify fruits on trees** to assist farmers in **yield estimation** while maintaining a **detailed history** of the classified fruits for improved tracking and management.

### 🌟 Project Scope:

The project is divided into **two main parts**:
1. **Model Development**: Building a deep learning computer vision model for processing, detecting, classifying, and counting fruits on trees.
2. **Application Development**: Integrating the model into an application, with a backend and a persistent database for seamless functionality.

---

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


---

## 🚀 Technologies Used

| Component            | Technology                          |
|-----------------------|-------------------------------------|
| **Model**            | Detectron2, Faster R-CNN |
| **Backend API**      | FastAPI                             |
| **Frontend**         | Flutter                             |
| **Backend**          | Express.js, MongoDB                |
| **Authentication**   | Firebase Auth                      |
| **Containerization** | Docker                              |
---

## 🏛️ Architecture

---

## 📜 Data:
- We collected **194 images** spanning 6 fruit categories: **Apples, Strawberries, Kiwis, Lemons, Oranges**, and an **Unknown** type.

- Each image was annotated using **LabelMe** to generate individual JSON files.  
   - These annotations include:
     - Bounding boxes.
     - Object categories.

- The images are in the directory dataset

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
![Model](./images/Feature Extraction and FPN.png) |

- **Backbone - ResNet-50**  
   - Extracts essential features from the input images using convolutional layers.  
   - At each layer, the image resolution is divided by 2, allowing for a detailed analysis at multiple scales.  

-  **Feature Pyramid Network (FPN)**  
   - Enhances the feature maps generated by ResNet-50 by combining features at different resolutions.  
   - Produces **multi-scale feature maps** that allow the model to detect fruits of various sizes effectively.  

#### **2. Fruit Detection and Classification Process**
![Fruit Detection and Classification](./images/Fruit_Detection_and_Classification_Process.png)

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
---

### 2. **Application Integration**
The model is integrated into the application via **FastAPI**:
- **Model Inference**: FastAPI serves as the backend API to perform predictions.
- **Endpoints**:
   - **/analyze**: Accepts input images for fruit detection.
   - **/get_analyzed_image**: Retrieves processed images with bounding boxes.
- **Data Flow**:
   - **Frontend**: Flutter app sends images to FastAPI.
   - **Backend**: FastAPI processes the image using the trained model and returns results.
   - **History Storage**: Results are stored in **MongoDB**.

---

## **Deployment with Kubernetes**

The deployment is based on **Kubernetes microservices** hosted on **Azure Kubernetes Service (AKS)**. 

### **Key Details**:
1. **Microservices**:
   - FastAPI for model inference.
   - Express.js for backend logic and history management.
2. **Scalability**:
   - Multiple **replicas** are created for each microservice to ensure high availability.
3. **Ingress Controller**:
   - Azure’s **webapprouting.kubernetes.azure.com** forwards external traffic to internal microservices securely.
4. **Pods and Cluster**:
   - The AKS cluster manages all pods with automated load balancing and scaling.
5. **Deployment URL**:
   - The final deployment URL is automatically updated in **Firebase Remote Config** after each successful pipeline run.

---

## **CI/CD Pipeline**

The **CI/CD pipeline** ensures a seamless and automated process from development to production. It is implemented using **GitLab CI/CD** with the following goals:

### **Pipeline Stages**:
1. **Testing**:
   - Runs unit tests and code coverage checks.
2. **Containerization**:
   - Docker images are built, tested, and pushed to the registry.
3. **Deployment**:
   - Application is deployed to **Dev**, **Stage**, and **Prod** environments on Kubernetes.
   - Ingress is configured to manage traffic routing.
4. **Integration Testing**:
   - Backend services are tested via **curl** commands to ensure endpoints are functioning.
5. **Post-Deployment**:
   - The deployment URL is stored in **Firebase Remote Config** to update the application automatically.

### **Workflow**:
![CI/CD Workflow](image.png)

For detailed configuration, refer to the [`.gitlab-ci.yml`](.gitlab-ci.yml) file&#8203;:contentReference[oaicite:0]{index=0}.

---

## **Technologies Used**

| Component            | Technology                          |
|-----------------------|-------------------------------------|
| **Model**            | Detectron2, Faster R-CNN, COCO Eval |
| **Backend API**      | FastAPI                             |
| **Frontend**         | Flutter                             |
| **Backend**          | Express.js, MongoDB                |
| **Authentication**   | Firebase Auth                      |
| **Containerization** | Docker                              |
| **Orchestration**    | Azure Kubernetes Service (AKS)      |
| **Ingress Controller**| Azure Web Application Routing      |
| **CI/CD**            | GitLab CI/CD                        |

---

## **Setup and Deployment**

### Prerequisites
- Docker
- Kubernetes CLI (`kubectl`)
- Azure Kubernetes Service (AKS) cluster set up
- GitLab CI with environment variables:
   - MongoDB credentials
   - Firebase service account

### Steps to Deploy
1. **Clone the repository**:
   ```bash
   git clone <repo-link>
   cd project-directory
