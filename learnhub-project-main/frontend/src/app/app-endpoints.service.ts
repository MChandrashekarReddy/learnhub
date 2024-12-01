import { Injectable } from '@angular/core';
import { request } from 'http';

@Injectable({
  providedIn: 'root'
})
export class AppEndpointsService {
  private readonly baseurl:string="http://127.0.0.1:5000"

  public readonly user={
    login:`${this.baseurl}/users/login`,
    singup:`${this.baseurl}/users`,
    updateUser:`${this.baseurl}/users`,
    getAll:`${this.baseurl}/users/details`,
    getUser:`${this.baseurl}/users`,
    getTotalUsers:`${this.baseurl}/users/count`,
    myCourses:`${this.baseurl}/users/courses`,
    profile:`${this.baseurl}/users/profile`,
    forgotPassword:`${this.baseurl}/users/forgotpassword`,
    updateEmail:`${this.baseurl}/users/updateemail`,
    updatePhoneNumber:`${this.baseurl}/users/update-phone-number`
  }
  public readonly course={
    getAllCourses:`${this.baseurl}/courses`,
    getCourseByName:`${this.baseurl}/courses`,
    getTotalCourses:`${this.baseurl}/courses/total`,
    addCourse:`${this.baseurl}/courses`,
    getContent:`${this.baseurl}/courses/content`,
    baseUrl:`${this.baseurl}/courses`,
    getRegisteredCourses:`${this.baseurl}/courses/registered`,
    getAvailableCoursesToRegister:`${this.baseurl}/courses/available`

  }
  public readonly payments={
    getAllPayments:`${this.baseurl}/payments`,
    myPayments:`${this.baseurl}/payments/mypayments`
  }
  public readonly category={
    getAllCategories:`${this.baseurl}/category`,
    addCategory:`${this.baseurl}/category`,
    getTotalCategories:`${this.baseurl}/category/total`,
    getAllTotalCategories:`${this.baseurl}/category/all`
  }
  public readonly content={
    addContent:`${this.baseurl}/contents`,
    baseUrl:`${this.baseurl}/contents`,
    getVideo:`${this.baseurl}/contents/video`
  }
  public readonly review={
    baseUrl:`${this.baseurl}/reviews`
  }
  public readonly questions={
    baseUrl:`${this.baseurl}/questions`
  }
  public readonly answers={
    addAnswer:`${this.baseurl}/answers`
  }
  public readonly enrollments={
    getTotalEnrollments:`${this.baseurl}/enrollements/total`,
    addEnrollments:`${this.baseurl}/enrollements`
  }
  public readonly progress={
    baseUrl:`${this.baseurl}/progress`
  }
  public readonly wishlist={
    baseUrl:`${this.baseurl}/wishlist`
  }
  public readonly email={
    baseurl:`${this.baseurl}/email`,
    verifyOtp:`${this.baseurl}/email/verify`,
    resetPassword:`${this.baseurl}/email/forgotpassword`,
    requestForUpdateEmail:`${this.baseurl}/email/resend-email-update-otp`,
    verifyOTPForReqeuestOfEmailUpdate:`${this.baseurl}/email/request-email-update`,
    verifyNewEmail:`${this.baseurl}/email/verify-email`,
    updatePhoneNumber:`${this.baseurl}/email/request-phonenumber-update-otp`
  }
  public readonly notifications={
    baseurl:`${this.baseurl}/notifications`,
    getCount:`${this.baseurl}/notifications/count`
  }
  constructor() { }
}
