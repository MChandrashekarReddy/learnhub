import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AdminComponent } from './features/admin/admin.component';
import { AuthorizationService } from './services/authorization.service';
import { UsersMangementComponent } from './features/users-mangement/users-mangement.component';
import { CourseManagementComponent } from './features/course-management/course-management.component';
import { PaymentsComponent } from './features/payments/payments.component';
import { CourseDetailComponent } from './features/course-detail/course-detail.component';
import { StudentdetailComponent } from './features/studentdetail/studentdetail.component';
import { InstructorDeatilComponent } from './features/instructordetail/instructordetail.component';
import { AdminbodyComponent } from './features/adminbody/adminbody.component';
import { InstructorComponent } from './features/instructor/instructor.component';
import { AddCourseComponent } from './features/add-course/add-course.component';
import { AddContentComponent } from './features/add-content/add-content.component';
import { ProfileManagementComponent } from './features/profile-management/profile-management.component';
import { ContentManagementComponent } from './features/content-management/content-management.component';
import { InstructorBodyComponent } from './features/instructor-body/instructor-body.component';
import { CourseContentComponent } from './features/course-content/course-content.component';
import { CourseOverviewComponent } from './features/course-overview/course-overview.component';
import { CourseDiscussionsComponent } from './features/course-discussions/course-discussions.component';
import { CourseNotesComponent } from './features/course-notes/course-notes.component';
import { CourseAssignmentsComponent } from './features/course-assignments/course-assignments.component';
import { CourseReviewsComponent } from './features/course-reviews/course-reviews.component';
import { StudentHomeComponent } from './features/student/student-home/student-home.component';
import { EditContentComponent } from './features/edit-content/edit-content.component';
import { MyLearningsComponent } from './features/student/my-learnings/my-learnings.component';
import { StudentBodyComponent } from './features/student/student-body/student-body.component';
import { WishlistComponent } from './features/student/wishlist/wishlist.component';
import { CoursePreviewComponent } from './features/course-preview/course-preview.component';
import { BodyComponent } from './features/body/body.component';
import { CourseEnrollmentComponent } from './features/course-enrollment/course-enrollment.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { TransactionsComponent } from './features/student/transactions/transactions.component';
import { AdminGuardService } from './services/guards/admin-guard.service';
import { InstructorGuardService } from './services/guards/instructor-guard.service';
import { StudentGuardService } from './services/guards/student-guard.service';
import { PdfVeiwerComponent } from './features/pdf-veiwer/pdf-veiwer.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent,canActivate:[AuthorizationService],children:[
    {path:'',component:BodyComponent},
    {path:'coursepreview/:name',component:CoursePreviewComponent},
    ]  
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [AdminGuardService], children: [
      { path: 'home', component: AdminbodyComponent },
      { path: 'users/:userType', component: UsersMangementComponent },
      { path: 'courses', component: CourseManagementComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'courses/:name', component: CourseDetailComponent },
      { path: 'studentDetail', component: StudentdetailComponent },
      { path: 'instructorDetail', component: InstructorDeatilComponent },
      { path:'notifications',component:NotificationsComponent},
      { path: 'profile', component: ProfileManagementComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },

    ]
  },
  {
    path: 'instructor', component: InstructorComponent, canActivate: [InstructorGuardService], children: [
      { path: 'home', component: InstructorBodyComponent},
      { path: 'addcourse', component: AddCourseComponent },
      { path: 'addcontent', component: AddContentComponent },
      { path:'edit/course/:name',component:EditContentComponent},
      { path: 'courses/:name', component: ContentManagementComponent, children: [
          { path: 'content', component: CourseContentComponent },
          { path: 'overview', component: CourseOverviewComponent },
          { path: 'discussions', component: CourseDiscussionsComponent },
          { path: 'notes', component: CourseNotesComponent },
          { path: 'assignments', component: CourseAssignmentsComponent },
          { path: 'reviews', component: CourseReviewsComponent },
        ]
      },
      { path: 'profile', component: ProfileManagementComponent },
      { path:'notifications',component:NotificationsComponent},
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  },
  {
    path:'student',component:StudentHomeComponent,canActivate:[StudentGuardService],children:[
      { path: 'home', component: StudentBodyComponent },
      { path:'coursepreview/:name',component:CoursePreviewComponent},
      { path:'mylearnings',component:MyLearningsComponent},
      { path:'enroll/:name',component:CourseEnrollmentComponent},
      { path: 'courses/:name', component: ContentManagementComponent, children: [
        { path: 'content', component: CourseContentComponent },
        { path: 'overview', component: CourseOverviewComponent },
        { path: 'discussions', component: CourseDiscussionsComponent },
        { path: 'notes', component: CourseNotesComponent },
        { path: 'assignments', component: CourseAssignmentsComponent },
        { path: 'reviews', component: CourseReviewsComponent },
      ]
      },
      { path: 'pdf-viewer/:url', component: PdfVeiwerComponent },
      { path:'wishlist',component:WishlistComponent},
      { path: 'profile', component: ProfileManagementComponent },
      { path:'notifications',component:NotificationsComponent},
      { path:'transactions',component:TransactionsComponent},
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
