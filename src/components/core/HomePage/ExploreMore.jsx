import React from "react"
import { HomePageExplore } from "../../../data/homepage-explore";
import HighlightText from "./HighlightText";
import { useState } from "react";
import CourseCard from "./CourseCard";
const tabsName=[
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
]
const ExploreMore = (props) => {
  // jis bhi tab prr click krenge ooska data hona chahiye 
  // agr "Free" prr click kiya to "Free" tab ka data hona chahiye
  // agr "Career paths" pr click kiya to "Career paths" ka data hona chahiye
  // so for this we will use "usestate"
  const [currentTab,setCurrentTab]= useState(tabsName[0]);
  // by default "tabsName" ke 0th index pr jo bhi value pda hua hai ooska data show hoga

   const [courses,setCourses]=useState(HomePageExplore[0].courses) //kaunse courses linked hai tabsName ke sath
  //  by default "currentTab" "Free" prr hoga aur "Free" kaa data "HomePageExplore" ke 0th index me hai so
  // "courses" state ke andr by default "HomePageExplore" ke 0th index pr jo "courses" hai ooska data hoga
       
  const [currentCard,setCurrentCard]=useState(HomePageExplore[0].courses[0].heading)
  // by default "currentCard" ke andr "HomePageExplore" ke 0th index pr jo "courses" hai oos "courses" ke
  // 0th index pr jo value hai oos prr clicked rhega
  // agr "Free" "tabsName" pr "currentTab" hai aur "Free" "tabsName"
  // ke jo bhi card prr click kiye hai ooska colour "white" hoga aur doosree unclicked cards ka
  // colour "black" hoga

   const setMyCards=(value)=>{
    setCurrentTab(value);//abb "currentTab" ka value update hoga

    // "currentTab" state is updated so we now update "courses" state 
    const result=HomePageExplore.filter(courses => courses.tag === value)// means we are filtering on the basis of tag
    // agr "currentTab" me value update hua "New to coding" so
    // const result = HomePageExplore.filter(courses => courses.New to coding
    // Note here in filter() courses is not a state it's just a parameter of filter()  )
    // Note filter() returns an array
    // result= [
    //     courses : [
    //         {
    //             heading : "HTML",
    //             description : "This course covers the basic concepts of HTML including creating and structuring web pages, adding text, links, images, and more.",
    //             level : 'Beginner',
    //             lessonNumber : 6
    //         },
    //         {
    //             heading : "CSS",
    //             description : "This course explores advanced topics in HTML5 and CSS3, including animations, transitions, and layout techniques",
    //             level : 'Beginner',
    //             lessionNumber : 6
    //         },
    //         {
    //             heading : "Responsive ",
    //             description : "This course teaches responsive web design techniques, allowing web pages to adapt to different devices and screen sizes",
    //             level : 'Beginner',
    //             lessionNumber : 6
    //         },
    //     ]
    // ],

    setCourses(result[0].courses);
    //courses =[ 
    //     here "courses" is a state
    //         {
    //             heading : "HTML",
    //             description : "This course covers the basic concepts of HTML including creating and structuring web pages, adding text, links, images, and more.",
    //             level : 'Beginner',
    //             lessionNumber : 6
    //         },
    //         {
    //             heading : "CSS",
    //             description : "This course explores advanced topics in HTML5 and CSS3, including animations, transitions, and layout techniques",
    //             level : 'Beginner',
    //             lessionNumber : 6
    //         },
    //         {
    //             heading : "Responsive ",
    //             description : "This course teaches responsive web design techniques, allowing web pages to adapt to different devices and screen sizes",
    //             level : 'Beginner',
    //             lessionNumber : 6
    //         }
    // ],

    setCurrentCard(result[0].courses[0].heading);//here the "courses" is property of "result"
    // currentCard=[ HTML ] => here currentCard is an array
   }

  return (
    <div>

      <div className="text-4xl font-semibold text-center">
        Unlock the 
        <HighlightText text={"Power of Code"}/>
      </div>

      <p className="text-center text-richblack-300 text-lg  text-[16px] mt-3">
        Learn to build anything that you can imagine
      </p>

      <div className="mt-5 flex flex-row rounded-full bg-richblack-800 mb-5 border-richblack-100 px-1 py-1">
        {
          tabsName.map(
            (element,index) =>
          {
            return(
              <div className={`text-[16px] flex flex-row items-center gap-2 
              ${currentTab === element ? "bg-richblack-900 text-richblack-5 font-medium" :
               "text-richblack-200"
               } 
                rounded-full transition-all duration-200 cursor-pointer
                hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`
               }
               key={index}
               onClick={()=>setMyCards(element)
                // jiss bhi "tabName" prr click kre ooske according sare "courses" ,"currentCard" "currentTab" inka value change ho jaye so we are using onClick()
                
               }>
                 {/* jis bhi "tabsName" pr clicked hoga ooska background color will be darkblack while other "tabsNAme" which has not been clicked it's background color will be light black */}
                 {element}
              </div>
            )
          }
          )
        }
      </div>

      <div className="hidden lg:block lg:h-[200px]"></div>

      {/* course card ka group */}
      <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {
          courses.map( (element,index) => {
            return(
              <CourseCard key={index} cardData={element} currentCard={currentCard}
              setCurrentCard={setCurrentCard}
              />
            )
          }
          )
        }
      </div>

    </div>
  )
};

export default ExploreMore;

