import { Component } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { count, interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent  {
public name :string="";
public questionList:any=[];
public currentQuestion:number=0;
public points:number=0;
counter=60;
correctAnswer:number=0;
incorrectAnswer:number=0;
intervel$:any;
progress:string="0";
isQuizCompleted:boolean=false;
constructor(private questionService:QuestionService){
  
    this.name = localStorage.getItem("name")!;
    this.getAllQuestion();
    this.startCounter();
}
getAllQuestion(){
  this.questionService.getQuestionJson()
  .subscribe(res=>{
    this.questionList=res.questions;
  })
}
nextQuestion(){
  this.currentQuestion++;
}
previousQuestion(){
  this.currentQuestion--;
}
answer(currentQno:number,option:any){

  if(currentQno === this.questionList.length){
    this.isQuizCompleted= true;
    this.stopCounter();
  }
  if(option.correct){
    this.points+=10;
    this.correctAnswer++;
    setTimeout(()=>{
      this.currentQuestion++;
      this.resetCounter();
      this.getProgress();
    },1000);
   
  }
  else{ 
    setTimeout(()=>{
      this.currentQuestion++;
      this.incorrectAnswer++;
      this.resetCounter();
      this.getProgress();
    },1000);
    this.points-=10;
  }

}
startCounter(){
  this.intervel$=interval(1000)
  .subscribe(val=>{
    this.counter--;
    if(this.counter===0){
      this.currentQuestion++;
      this.counter=60;
      this.points-=10;
    }
  });
  setTimeout(()=>{
    this.intervel$.unsubscribe();
  },600000);

}
stopCounter(){
  this.intervel$.unsubscribe();
  this.counter=0;
}
resetCounter(){
  this.stopCounter();
  this.counter=60;
  this.startCounter();
}
restQuiz(){
  this.resetCounter();
  this.getAllQuestion();
  this.points=0;
  this.counter=60;
  this.currentQuestion=0;
  this.progress="0";
}
getProgress(){
  this.progress=((this.currentQuestion/this.questionList.length)*100).toString();
  return this.progress;
}
}
