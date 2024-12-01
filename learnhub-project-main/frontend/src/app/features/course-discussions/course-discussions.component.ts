import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { error, log } from 'console';
import { data } from 'jquery';
import { DiscussionsService } from 'src/app/services/discussions.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-course-discussions',
  templateUrl: './course-discussions.component.html',
  standalone:false,
  styleUrls: ['./course-discussions.component.css']
})
export class CourseDiscussionsComponent implements OnInit {
  courseName: string = '';
  discussions: Question[] = []
  isStudent:Boolean=false
  question=''
  constructor(private sharedService: SearchService, private discussionService: DiscussionsService,private router:Router) {

  }

  ngOnInit(): void {
    this.sharedService.currentCourse.subscribe(courseName => {
      this.courseName = courseName;
      this.getDiscusiions(this.courseName);
    });
    this.isStudent=this.router.url.startsWith("/student");

  }

  getDiscusiions(courseName: string): void {
    this.discussionService.getDiscussions(courseName).subscribe(
      data => {
        this.discussions = data.map((item: any) => this.parseQuestionData(item));
      },
      error => console.error(error)
    );
  }
  private parseQuestionData(data: any): Question {
    return {
      ...data,
      asked_at: new Date(data.asked_at),
      answers: data.answers.map((answer: any) => ({
        ...answer,
        answered_at: new Date(answer.answered_at),
      }))
    };
  }
  show(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation()
    event.stopPropagation()
    const actualElement = event.target as HTMLElement
    const parentElement = actualElement.parentElement as HTMLElement
    const grandParentElemnt = parentElement.parentElement as HTMLElement
    const targetElement = grandParentElemnt.nextElementSibling as HTMLElement
    if (targetElement.className === 'card-body') {
      actualElement.style.transform = actualElement.style.transform === "rotate(0deg)" ? "rotate(180deg)" : "rotate(0deg)";
      targetElement.style.display = targetElement.style.display === 'none' ? 'block' : 'none';
    }
  }
  isValid(question: string) {
    if (question.startsWith(' ') || question.endsWith(' ')) return false
    question = question.trim();
    if (question.length < 3) return false
    if (question.length > 500) return false
    return true
  }
  onSubmit(question_id: string, event: Event) {
    event.stopPropagation();
    const actualElement = event.target as HTMLElement
    const parentElement = actualElement.parentElement
    const targetElement = parentElement?.previousElementSibling as HTMLInputElement
    const answer = targetElement.value
    if (this.isValid(answer)) {
      this.discussionService.addAnswer({ 'question_id': question_id, 'answer': answer }).subscribe(
        data => {
          alert("your answer added successfully")
          targetElement.value = ''
          this.getDiscusiions(this.courseName)
        },
        error => alert(error.error.message)
      )
    }
    else{
      alert('Plz provide valid answer')
    }
  }
  submitQuestion() {
    if (this.question && this.isValid(this.question)) {
      this.discussionService.addQuestion({"question_content":this.question,"course_name":this.courseName}).subscribe(
        data=>{
          this.getDiscusiions(this.courseName);
          alert("Your query has been successfully submitted");
          this.question=''
        },
        error=>{
          console.log(error.error.message)
        }
      )
    } else {
      alert('Please enter a valid question.');
    }
  }
}

interface Question {
  answers: Answer[];
  asked_at: Date;
  question: string;
  question_id: string,
  questioned_by: string;
  questioner_img: string | null;
}

interface Answer {
  answer: string;
  answer_by: string;
  answered_at: Date;
  answered_img: string | null;
  role: string;
}
