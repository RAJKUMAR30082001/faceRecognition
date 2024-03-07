import { Injectable } from '@angular/core';
import { CouchDbService } from './couch-db.service';
// import { LabeledFaceDescriptors } from 'face-api.js';
declare const faceapi: any;

@Injectable({
  providedIn: 'root'
})
export class FaceDetectionService {


  constructor(private couch: CouchDbService) { }
  public video: HTMLVideoElement | undefined;
  public displaySize: { width: number; height: number } = { width: 0, height: 0 }; // Provide initial values
  public discriptions: any[] = [];
  public flag: boolean = false;
  public results: any;
  public promise: Promise<any[]> | undefined;
  public resize:any
  

  async FaceDetection(video?: HTMLVideoElement): Promise<any> {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('./assets/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('./assets/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('./assets/models'),
      faceapi.nets.ssdMobilenetv1.loadFromUri('./assets/models')
    ]);

    let canva = await faceapi.createCanvasFromMedia(video);
    const div = document.getElementById("canvacontainer");
    if (div) {
      div.append(canva);
    }

    if (video) {
      this.displaySize = { width: video.width, height: video.height };
    }

    faceapi.matchDimensions(canva, this.displaySize);

    this.results = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
    console.log("results:",this.results);

    this.resize = faceapi.resizeResults(this.results, this.displaySize);
    console.log("resize naan thaan",this.resize);
    canva.getContext('2d').clearRect(0, 0, canva.width, canva.height);
    faceapi.draw.drawDetections(canva, this.resize);
    

    return this.results;
  }

 

  async detectPhoto(): Promise<any[]> {
    let descriptorsArray
    try {
      const image = await faceapi.fetchImage('./assets/newphoto.jpg');
      const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();

      if (detections && detections.length > 0) {
        descriptorsArray = detections.map((face: { descriptor: any }) => face.descriptor);
        console.log(descriptorsArray,"i am descrptoresArray")

        const labeledDescriptors = new faceapi.LabeledFaceDescriptors('raj', descriptorsArray);
       if(labeledDescriptors){
        this.discriptions.push(labeledDescriptors);
        console.log(labeledDescriptors);

        // const faceMatcher = new faceapi.FaceMatcher([labeledDescriptors]);
      }
        // You can use the faceMatcher here if needed
      }

      return  this.discriptions;
    } catch (error) {
      console.error('Error during face detection:', error);
      return []
    }
  }
  async getListOfDescriptor(faceArray:any[]){
    console.log("error here")
    const facematch=new faceapi.FaceMatcher(faceArray)
    // console.log("finished")

    for(let i of this.resize){
      console.log(i.descriptor.length,"length of array")
      const result = facematch.findBestMatch(i.descriptor);
      // faceapi.draw.drawDetections(canvas, [face]);
      console.log('Matched:', result.toString());

    }

  }
}

















    //     const detectedDescriptors = await faceapi.detectSingleFace(newImage).withFaceDescriptor();
    // const storedDescriptors = this.couchDbService.getStoredDescriptorsByUsername(username);

    // Compare detectedDescriptors with storedDescriptors
    // const isMatch = await faceapi.utils.round(
    //   faceapi.euclideanDistance(this.results.descriptor, faceArray)
    // ) < 0.5;

    // if (isMatch) {
    //   console.log("Face verification successful")
    // } else {
    //   console.log("Face verification failed")
    // }



 