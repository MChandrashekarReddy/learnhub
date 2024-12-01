import { Component, OnInit } from '@angular/core';
import { CoursesService } from 'src/app/services/courses.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  standalone:false,
  styleUrls: ['./course-overview.component.css']
})
export class CourseOverviewComponent implements OnInit {
  courseOverView: CourseOverview = {
    avg_rating: 0,
    course_description: '',
    course_img: '',
    course_name: '',
    no_of_enrollments: 0,
    no_of_lessons: 0,
    no_of_reviews: 0,
    total_duration:'',
    category:''
  };
  courseName!: string;

  constructor(private courseService: CoursesService, private searchService: SearchService) { }

  ngOnInit(): void {
    this.searchService.currentCourse.subscribe(courseName => {
      this.courseName = courseName;
      if (this.courseName) {
        this.getCourseOverView(this.courseName);
      }
    });
  }

  getCourseOverView(courseName: string) {
    this.courseService.getOverview(courseName).subscribe(
      data => {
        this.courseOverView = {
          avg_rating: Number(data.avg_rating),
          no_of_reviews: Number(data.no_of_reviews),
          no_of_lessons: Number(data.no_of_lessons),
          no_of_enrollments: Number(data.no_of_enrollments),
          course_description: data.course_description,
          course_name: data.course_name,
          course_img: data.course_img,
          total_duration:data.total_duration,
          category:data.category,
          created_at:new Date(data.created_at)
        };
      },
      error => {
        console.error(error.error.message);
      }
    );
  }
}

interface CourseOverview {
  avg_rating: number;
  course_description: string;
  course_img: string;
  course_name: string;
  no_of_enrollments: number;
  no_of_lessons: number;
  no_of_reviews: number;
  total_duration:string;
  category:string;
  created_at?:Date;
}
