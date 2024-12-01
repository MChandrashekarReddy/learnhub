from flask_jwt_extended import get_jwt_identity
from moviepy.editor import VideoFileClip
from app.appMain import db
from app.appMain.models.content import Content
from app.appMain.service.enrollment import EnrollmentSevice
from app.appMain.service.user import UserService
from app.appMain.service.course import CourseService
from app.appMain.service.progress import ProgressService
from app.appMain.utils.exceptions import NoContentFoundException,ContentNotFound,CourseNotFound,InsufficientData,PermissionDeniedException, VideoProcessingException


class ContentService:
    @staticmethod
    def add_content(data):
        from app.appMain.service.notifications import NotificationService
        if UserService.is_instructor():
            course_name=data.get("course_name")
            content_name=data.get("content_name")
            content_doc_path=data.get("content_doc_path")
            content_video_path=data.get("content_video_path")
            content_quiz_path=data.get("content_quiz_path")
            content_assignment_path=data.get("content_assignment_path")
            if not all([course_name,content_name,content_video_path]):
                raise InsufficientData
            course=CourseService.is_course_avalibale(course_name)
            try:
                video = VideoFileClip("/home/chandrasekhar/Desktop/learnHub/frontend/frontend/src/" + content_video_path[9:])
                duration = video.duration
                minutes = int(duration // 60)
                seconds = int(duration % 60)
                content_video_duration = f"{minutes}:{seconds:02d}"
            except FileNotFoundError:
                raise VideoProcessingException(f"Video file not found: {content_video_path}. Please check the path.")
            except Exception as e:
                raise VideoProcessingException(f"Error processing video: {str(e)}")    

            if not course:
                raise CourseNotFound
            content=Content(course_id=course.course_id,content_name=course_name+'-'+content_name,content_doc_path=content_doc_path,content_video_path=content_video_path,content_quiz_path=content_quiz_path,content_assignment_path=content_assignment_path,content_video_duration=content_video_duration)
            try:
                db.session.add(content)
                db.session.commit()
                NotificationService.notify_enrolled_students_of_new_content(course_name)
            except Exception as e:
                db.session.rollback()
                raise e
            finally:
                db.session.close()
        else:
            raise PermissionDeniedException
    @staticmethod
    def get_content_by_name(content_name):
        return Content.query.filter_by(content_name=content_name).first()
    
    @staticmethod
    def getNotes(course_name):
        if not course_name:
            raise InsufficientData("Course name is required")

        course_id = CourseService.getCourseId(course_name)
        if not course_id:
            raise CourseNotFound("Course not found")

        if UserService.is_instructor():
            permission = CourseService.is_valid_instructor(course_name)
            if not permission:
                raise PermissionDeniedException("You don't have permission to access this course")
            contents = Content.query.filter_by(course_id=course_id).all()
            material = []
            quizzes = []
            for content in contents:
                material.append({
                    'content_name': content.content_name, 
                    'content_notes': content.content_doc_path,
                    'quiz': content.content_quiz_path
                })
            return material
        elif UserService.is_student():
            user_id=get_jwt_identity()
            permission =EnrollmentSevice.is_registered_for_course(user_id,course_id)
            contents = Content.query.filter_by(course_id=course_id).all()
            if not permission:
                count=0
                material = []
                for content in contents:
                    if count==1:
                        material.append({
                            'content_name': content.content_name, 
                            'content_notes': content.content_doc_path,
                            'quiz': content.content_quiz_path
                        })
                    else:
                        material.append({
                            'content_name': content.content_name, 
                            'content_notes': "null",
                            'quiz': "null"
                        })
                    count+=1
                return material
            else:
                material = []
                for content in contents:
                    material.append({
                        'content_name': content.content_name, 
                        'content_notes': content.content_doc_path,
                        'quiz': content.content_quiz_path
                    })
                return material
    @staticmethod
    def getAssignments(course_name):
        if not course_name:
            raise InsufficientData("Course name is required")
        course_id = CourseService.getCourseId(course_name)
        if not course_id:
            raise CourseNotFound("Course not found")
        if UserService.is_instructor():
            permission = CourseService.is_valid_instructor(course_name)
            if not permission:
                raise PermissionDeniedException("You don't have permission to access this course")
            contents = Content.query.filter_by(course_id=course_id).all()
            assignments = [{'content_name': content.content_name, 'content_assignment': content.content_assignment_path} for content in contents]
            return assignments
        elif UserService.is_student():
            user_id=get_jwt_identity()
            permission =EnrollmentSevice.is_registered_for_course(user_id,course_id)
            content_list = Content.query.filter_by(course_id=course_id).all()
            if not permission:
                count=0
                contents=[]
                for content in content_list:
                    if(count==0):
                        contents.append({'content_name': content.content_name, 'content_assignment': content.content_assignment_path})
                    else:
                        contents.append({'content_name': content.content_name, 'content_assignment':"null"})
                    count+=1
                return contents
            else:
                contents = [{'content_name': content.content_name, 'content_assignment': content.content_assignment_path} for content in content_list]
                return contents 
    @staticmethod
    def getVideos(course_name):
        if not course_name:
            raise InsufficientData("Course name is required")
        course_id = CourseService.getCourseId(course_name)
        if not course_id:
            raise CourseNotFound("Course not found")
        if UserService.is_instructor():
            permission = CourseService.is_valid_instructor(course_name)
            if not permission:
                raise PermissionDeniedException("You don't have permission to access this course")
            content_list = Content.query.filter_by(course_id=course_id).all()
            contents = [{'content_id':content.content_id,'content_name': content.content_name, 'content_video': content.content_video_path,'duration':content.content_video_duration} for content in content_list]
            return contents
        elif UserService.is_student():
            user_id=get_jwt_identity()
            permission =EnrollmentSevice.is_registered_for_course(user_id,course_id)
            content_list = Content.query.filter_by(course_id=course_id).all()
            if not permission:
                count=0
                contents=[]
                for content in content_list:
                    if(count==0):
                        contents.append({'content_id':content.content_id,'content_name': content.content_name, 'content_video': content.content_video_path,'duration':content.content_video_duration})
                    else:
                        contents.append({'content_name': content.content_name, 'content_video':"null",'duration':content.content_video_duration})
                    count+=1
                return contents
            else:
                contents = [{'content_id':content.content_id,'content_name': content.content_name, 'content_video': content.content_video_path,'duration':content.content_video_duration,"completion_percentage":ProgressService.getContentProgress(course_name,content.content_id)} for content in content_list]
                return contents
        
    @staticmethod
    def getContent(course_name):
        if not course_name:
            raise InsufficientData("Course name is required")
        course_id = CourseService.getCourseId(course_name)
        if not course_id:
            raise CourseNotFound("Course not found")
        if not UserService.is_instructor():
             raise PermissionDeniedException("You don't have permission to access this course")
        contents = Content.query.filter_by(course_id=course_id).all()
        data = [{'content_name': content.content_name,'content_video': content.content_video_path ,'content_assignment': content.content_assignment_path,'content_notes': content.content_doc_path, 'content_quiz': content.content_quiz_path} for content in contents]
        return data
    
    @staticmethod
    def getVideo(data):
        content_id=data.get("content_id")
        if not content_id:
            raise InsufficientData
        content =Content.query.get(content_id)
        if not content:
            raise ContentNotFound
        if UserService.is_instructor():
            permission = CourseService.is_valid_instructor(content.course.course_name)
            if not permission:
                raise PermissionDeniedException("You don't have permission to access this course")
            return {'content_name': content.content_name, 'content_video': content.content_video_path,'duration':content.content_video_duration}
        elif UserService.is_student():
            user_id=get_jwt_identity()
            permission =EnrollmentSevice.is_registered_for_course(user_id,content.course_id)
            if not permission:
               raise PermissionDeniedException("You don't have permission to access this course")
            else:
                return {'content_id':content.content_id,'content_name': content.content_name, 'content_video': content.content_video_path,'duration':content.content_video_duration,"completion_percentage":ProgressService.getContentProgress(content.course.course_name,content.content_id)}
            
    @staticmethod
    def getContentOverview(course_name):
        if not course_name:
            raise InsufficientData("Course name is required")
        course_id = CourseService.getCourseId(course_name)
        if not course_id:
            raise CourseNotFound("Course not found")
        contents_list=Content.query.filter_by(course_id=course_id).all()
        if len(contents_list)==0:
            raise NoContentFoundException
        contents=[]
        count=0
        for content in contents_list:
            if count==0:
                contents.append({'content_name': content.content_name,'content_doc_path': content.content_doc_path,'content_video_path': content.content_video_path,'content_quiz_path': content.content_quiz_path,'content_assignment_path': content.content_assignment_path})
            else:
                contents.append({'content_name': content.content_name,'content_doc_path':"null",'content_video_path':"null",'content_quiz_path': "null",'content_assignment_path':"null"})
            count+=1
        return contents