import { Component, OnInit, Renderer2 } from '@angular/core';
import { FaceDetectionService } from '../face-detection.service';
import { CouchDbService } from '../couch-db.service';
import { v4 as uuidv4 } from 'uuid';
declare const faceapi:any;

@Component({
  selector: 'app-webcam-component',
  templateUrl: './webcam-component.component.html',
  styleUrls: ['./webcam-component.component.scss']
})
export class WebcamComponentComponent implements OnInit {
  public username:string="rajkumar"
  public imageElement?: HTMLImageElement;
  public imageUrl?: string;
  public video?: HTMLVideoElement;
  public id=uuidv4();

  constructor(private faceapI: FaceDetectionService, private render: Renderer2,private couch:CouchDbService) { }

  ngOnInit() {
    this.video = this.render.selectRootElement("#myVideo") as HTMLVideoElement;
    
    this.streamVideo();
  }

  async streamVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.video) {
        this.video.srcObject = stream;
        this.video.addEventListener('play', async()=>{
          try{
            const results=await this.faceapI.FaceDetection(this.video)
            console.log("Result", results);
         
        }catch(error){
          console.log(error)
        }
        })
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

  async captureImage() {
  
    let value:any
    const canva = document.createElement("canvas");
    try {
      if (this.video) {
        canva.width = this.video.videoWidth || 600;
        canva.height = this.video.videoHeight || 400;
        const context = canva.getContext("2d");
        if (context) {
          context.drawImage(this.video, 0, 0, canva.width, canva.height);
        }
        document.body.append(canva);

        canva.toBlob((blob) => {
          if (blob) {
            console.log(blob);
            this.imageUrl = URL.createObjectURL(blob);
            this.imageElement = new Image();
            if (this.imageElement) {
              this.imageElement.src = this.imageUrl ?? "";
            }
          }
        }, 'image/png');
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
    const val=await this.faceapI.detectPhoto()
    console.log(val,'deteecteed photo')
    this.couch.putData({"username":`${this.username}`,"image":`${this.imageUrl}`,"descriptor":val},this.id).subscribe(res=>
    console.log("couch res",res))
    let labeledArray:any[]=[]
    this.couch.getAllDocuments().subscribe(data=>
      {
        
      value=data.rows
      console.log(value,"i am value")
        if(value){
          for(let i of value){
          console.log(Object.values(i.value.faceLandmark),"faceLand Mark")
          // if(i.value.faceLandmark)
          labeledArray.push(i.value.faceLandmark)
          // labeledArray.push(new faceapi.LabeledFaceDescriptors(i.value.faceLandmark.label, i.value.faceLandmark.descriptors))

        }}
      //     // const labeledFaceDescriptors = value.map((item: { label: string; descriptors: number[] }) =>{
      //     //   console.log("length",item.descriptors.length)
      //     //   // console.log("length1",[new Float32Array(item.descriptor)].length)
      //     // return new faceapi.LabeledFaceDescriptors(String(item.label), [new Float32Array(item.descriptors)])
        
      //   // })
      //     console.log("finished labeld",labeledArray[0])
      //     console.log("array",labeledArray)
      //       this.faceapI.getListOfDescriptor(labeledArray[0])
      //     }
      // console.log("i am descriptor landmark length",value[0].value.faceLandmark[0].descriptors)
      // for (let i =0;i<value.length;i++){
        
      //   value[i].value.faceLandmark[i].descriptors = new Float32Array(Object.values(value[i].value.faceLandmark[i].descriptors));
        
      //   // value[i] = new faceapi.LabeledFaceDescriptors(value[i].value.faceLandmark[i].label, value[i].value.faceLandmark[i].descriptors);
      //   console.log(value[i],"i am final")
      // }
      const faceLandmark=value.map((face: { value: { faceLandmark: any; }; })=> face.value.faceLandmark)
      console.log(faceLandmark,"landmark")
      for (let i of faceLandmark){
        console.log(i[0].descriptors,"descriptors")
        let array=new  Float32Array(i[0].descriptors)
        console.log(array)
        
        const val=new faceapi.LabeledFaceDescriptors(i[0].label,array);
        labeledArray.push(val)
        console.log(labeledArray,"i am final array")
      }















      // for (let arr of faceLandmark) {
      //   for (let obj of arr) {
      //     const descriptorsArray = obj.descriptors;
      //     const des=new Float32Array(descriptorsArray);
      //     console.log(des);
      //   }
      // }
          
      // })
      
      })
    
  }
    }


