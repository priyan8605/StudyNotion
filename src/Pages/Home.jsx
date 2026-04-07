import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from '../assets/Images/banner.mp4';
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/Timelinesection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import Footer from "../components/Common/Footer.jsx"
import ExploreMore from "../components/core/HomePage/ExploreMore.jsx";
import ReviewSlider from "../components/Common/ReviewSlider.jsx";
const Home=()=>
{
  
 return(
    <div>
        <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between ">
             {/* section 1 */}
             
                <Link to={'/signup'}>
                   <div className="group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 
                   transition-all duration-200 hover:scale-95 w-fit">
                    {/* "group" property of tailwind :- agr hum chahte hai ki jbb bhi hum hover kre to parent ka background colour 
                    aur dark ho jaye to iske liye hum "group" property ka use krr skte hai 
                    "group property in tailwind" :- Applied on the parent  */}
                       <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                       transition-all duration-200 group-hover:bg-richblack-900">
                        <p>
                            Become an Instructor
                        </p>
                        <FaArrowRight/>
                       </div>
                   </div>
                </Link>
             
             <div className="text-center text-4xl font-semibold mt-6">
                Empower Your Future with your 
                <HighlightText text={' Coding Skills'}/>
             </div>

             <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">
             <p>
                With our online coding courses, you can learn at your own pace ,from 
                anywhere in the world,and get access to a wealth of resources,including
                 hands-on projects, quizzes, and personalized feedback from instructors. 
             </p>
             </div>

             <div className="flex flex-row gap-7 mt-8">
               <CTAButton active={true} linkto={'/signup'}>
                Learn More
               </CTAButton>
               <CTAButton active={false} linkto={'/login'}>
                Book a Demo
               </CTAButton>
             </div>

             <div className="mx-3 my-12 shadow-blue-200 ">
               <video
               muted
               loop
               autoPlay
               // jo bhi video hai vo humesha starting me muted hoga jbb tkk oose unmute nhi kiya jaye
               // jo bhi video daala hai vo loop prr chalega and vo video autoPlay bhi hoga
               >
                <source src={Banner} type="video/mp4"/>
               </video>
             </div>

             {/* code section 1 */}
            <div>
                 <CodeBlocks 
                 position={"lg:flex-row"}
                 heading={
                   <div className="text-4xl font-semibold">
                      Unlock your 
                      <HighlightText text={' Coding Potential '}></HighlightText>
                      with our online courses
                   </div>
                 }
                 subheading={
                  "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }

                ctabtn1={{
                  btnText: "Try it Yourself",
                  linkto: "/signup",
                  active: true,
                }}
                ctabtn2={{
                  btnText: "Learn More",
                  linkto: "/login",
                  active: false,
                }}
                codeColor={"text-yellow-25"}
                codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> \n <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                backgroundGradient={<div className="codeblock1 absolute"></div>}
                 />
              </div>

               {/* Code Section 2 */}
        <div>
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-white"}
            codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
            backgroundGradient={<div className="codeblock2 absolute"></div>}
          />
        </div>
            <ExploreMore/>
        </div>

         {/* section 2 */}
         <div className="bg-pure-greys-5 text-richblack-700">
            <div className="homepage_bg h-[310px]">
               {/* 
               homepage_bg => it's css property is assigned in App.css =>
               homepage_bg => this will apply background image white 
               h-[310px] => it's the height of background image white
               */}
               <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto ">
               {/* 
                max-w-maxContent=> max width is 1160px 
                w-11/12 => because of it jo bhi view width hai screen ka ooske  11/12 part me hi
                content place krr rhe hai 
               */}
               <div className="h-[150px]"></div>
               <div className="flex flex-row gap-7 text-white ">
                  <CTAButton active={true} linkto={'/signup'}>
                      <div className="flex  items-center gap-3">
                        Explore Full Catalog 
                        <FaArrowRight/>
                      </div>
                  </CTAButton>
                  <CTAButton active={false} linkto={"/signup"}>
                    <div>
                      Learn More
                    </div>

                  </CTAButton>
               </div>

            </div>
         </div>

         
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">

          {/* Job that is in Demand - Section 1 */}
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%] ">
              Get the skills you need for a{" "}
              <HighlightText text={"job that is in demand."} />
            </div>
            <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div className="">Learn More</div>
              </CTAButton>
            </div>
          </div>

          <TimelineSection/>

            <LearningLanguageSection/>

         
        </div>

        
          {/* section 3 */}
        <div className="flex flex-row w-11/12 mx-auto max-w-maxContent 
          flex-col items-center gap-8 bg-richblack-900 justify between text-white">

          <InstructorSection/>
{/* 
          <h2 className="text-center text-4xl font-semibold mt-10">
            Review from other learners
          </h2> */}
          <ReviewSlider/>

        </div>
     
            {/* section 4 or footer */}
          <Footer/>

        
    </div>
    </div>
 )
}
export default Home