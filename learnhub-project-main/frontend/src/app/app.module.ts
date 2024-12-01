import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from  '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { NavComponent } from './features/nav/nav.component';
import { FooterComponent } from './features/footer/footer.component';
import { LoginComponent } from './features/login/login.component';
import { BodyComponent } from './features/body/body.component';
import { SignupComponent } from './features/signup/signup.component';
import { AdminNavComponent } from './features/admin-nav/admin-nav.component';
import { CategoryaddComponent } from './features/categoryadd/categoryadd.component';
import { AdminComponent } from './features/admin/admin.component';
import { AdminbodyComponent } from './features/adminbody/adminbody.component';
import { ChangepasswordComponent } from './features/changepassword/changepassword.component';
import { UpdateemailComponent } from './features/updateemail/updateemail.component';
import { UsersMangementComponent } from './features/users-mangement/users-mangement.component';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CourseManagementComponent } from './features/course-management/course-management.component';
import { PaymentsComponent } from './features/payments/payments.component';
import { CourseDetailComponent } from './features/course-detail/course-detail.component';
import { StudentdetailComponent } from './features/studentdetail/studentdetail.component';
import { InstructorDeatilComponent } from './features/instructordetail/instructordetail.component';
import { CategoiresManagementComponent } from './features/categoires-management/categoires-management.component';
import { InstructorComponent } from './features/instructor/instructor.component';
import { InstructorNavComponent } from './features/instructor-nav/instructor-nav.component';
import { InstructorBodyComponent } from './features/instructor-body/instructor-body.component';
import { AddCourseComponent } from './features/add-course/add-course.component';
import { AddContentComponent } from './features/add-content/add-content.component';
import { ProfileManagementComponent } from './features/profile-management/profile-management.component';
import { ContentManagementComponent } from './features/content-management/content-management.component';
import { CourseContentComponent } from './features/course-content/course-content.component';
import { CourseOverviewComponent } from './features/course-overview/course-overview.component';
import { CourseDiscussionsComponent } from './features/course-discussions/course-discussions.component';
import { CourseNotesComponent } from './features/course-notes/course-notes.component';
import { CourseAssignmentsComponent } from './features/course-assignments/course-assignments.component';
import { CourseReviewsComponent } from './features/course-reviews/course-reviews.component';
import { StudentHomeComponent } from './features/student/student-home/student-home.component';
import { StudentNavComponent } from './features/student/student-nav/student-nav.component';
import { StudentBodyComponent } from './features/student/student-body/student-body.component';
import { EditContentComponent } from './features/edit-content/edit-content.component';
import { MyLearningsComponent } from './features/student/my-learnings/my-learnings.component';
import { WishlistComponent } from './features/student/wishlist/wishlist.component';
import { CoursePreviewComponent } from './features/course-preview/course-preview.component';
import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component';
import { UpdatePhonenumberComponent } from './features/update-phonenumber/update-phonenumber.component';
import { CourseEnrollmentComponent } from './features/course-enrollment/course-enrollment.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { TransactionsComponent } from './features/student/transactions/transactions.component';
import { RouterModule } from '@angular/router';
import { PdfVeiwerComponent } from './features/pdf-veiwer/pdf-veiwer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    BodyComponent,
    SignupComponent,
    AdminNavComponent,
    CategoryaddComponent,
    AdminComponent,
    AdminbodyComponent,
    ChangepasswordComponent,
    UpdateemailComponent,
    UsersMangementComponent,
    CourseManagementComponent,
    PaymentsComponent,
    CourseDetailComponent,
    StudentdetailComponent,
    InstructorDeatilComponent,
    CategoiresManagementComponent,
    InstructorComponent,
    InstructorNavComponent,
    InstructorBodyComponent,
    AddCourseComponent,
    AddContentComponent,
    ProfileManagementComponent,
    ContentManagementComponent,
    CourseContentComponent,
    CourseOverviewComponent,
    CourseDiscussionsComponent,
    CourseNotesComponent,
    CourseAssignmentsComponent,
    CourseReviewsComponent,
    StudentHomeComponent,
    StudentNavComponent,
    StudentBodyComponent,
    EditContentComponent,
    MyLearningsComponent,
    WishlistComponent,
    CoursePreviewComponent,
    ForgotPasswordComponent,
    UpdatePhonenumberComponent,
    CourseEnrollmentComponent,
    NotificationsComponent,
    TransactionsComponent,
    PdfVeiwerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    RouterModule
    
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
