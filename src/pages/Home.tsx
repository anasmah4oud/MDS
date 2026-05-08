/**



@license

SPDX-License-Identifier: Apache-2.0

*/

import React, { useState, useEffect } from 'react';

import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

import { Link, useNavigate } from 'react-router-dom';

import {

Menu, X, ChevronRight, CheckCircle, GraduationCap,

Users, BookOpen, Headset, MessageSquare, PhoneCall,

Globe, LayoutDashboard, LogIn, UserPlus

} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

import '../styles/Home.css';



export default function Home() {

const { scrollYProgress } = useScroll();

const scaleX = useSpring(scrollYProgress, {

stiffness: 100,

damping: 30,

restDelta: 0.001

});



const { user, profile, isAdmin, loading } = useAuth();

const navigate = useNavigate();

const [isMenuOpen, setIsMenuOpen] = useState(false);



// Show loading while checking auth

if (loading) {

return (



);

}



useEffect(() => {

// Wait for auth to finish loading before redirecting

if (!loading && user && profile) {

if (isAdmin) {

navigate('/anas/md/200/9', { replace: true });

} else {

navigate('/dashboard', { replace: true });

}

}

}, [user, profile, isAdmin, navigate, loading]);



return (



{/ Progress Bar /}




{/ Navbar /}

window.scrollTo(0, 0)}>



البارع



محمود الديب



{/ Desktop Menu /}








تسجيل الدخول




إنشاء حساب







تواصل معنا

الدعم الفني








{/ Mobile Toggle /}

setIsMenuOpen(!isMenuOpen)}>

{isMenuOpen ? : }














{/ Mobile Menu /}


{isMenuOpen && (







تسجيل الدخول

إنشاء حساب جديد

تواصل معنا

الدعم الفني

الدعم العلمي







)}









{/ Hero Section /}

















البارع محمود الديب











أستاذ اللغة العربية للثانوية العامة ومؤلف سلسلة البارع







ابدأ رحلتك الآن












{ e.currentTarget.src = "https://placehold.co/600x800?text=محمود+الديب" }}

/>






















{/ تكرار مرتين علشان الحركة تبقى seamless /}

{[...Array(2)].map((_, j) =>

Array(10).fill("( وما توفيقي إلا بالله )").map((text, i) => (


{text}


))

)}













{/ Features Section /}

لماذا منصة البارع؟



{/ Center Logo /}

©



{/ Left Features /}






}

title="شرح مفصل"

desc="شرح مفصل لكل جزء من أجزاء المنهج بأسلوب مبسط"

/>

}

title="متابعة مستمرة"

desc="متابعة مستمرة مع ولي الأمر لضمان تقدم الطالب"

/>








{/ Right Features /}






}

title="امتحانات دورية"

desc="امتحانات على كل حصة لتقييم استيعاب الطالب"

/>

}

title="امتحان شامل"

desc="امتحان شامل كل شهر مع هدايا قيمة للمتفوقين"

/>























{/ Grades Section /}

المراحل الدراسية



اختر صفك الدراسي وابدأ الآن



{/ Motivation Section /}

البارع محمود الديب



ابدأ رحلتك نحو التفوق الآن














{/ Stats Section /}

البارع محمود الديب



دي مش مجرد أرقام دي أدلة أنك في المكان الصح



1200

حصة تعليمية



5000

طالب فخور



{ e.currentTarget.src = "https://placehold.co/600x600?text=محمود+الديب" }}

/>























{/ Footer /}

البارع



المنصة التعليمية الأولى لتبسيط اللغة العربية لطلاب الثانوية العامة في مصر. نسعى دائماً للتميز والتفوق.

روابط سريعة



الدعم الفني

تواصل معنا

تسجيل الدخول

تواصل مباشر



واتساب: 01006984012



جميع الحقوق محفوظة للأستاذ محمود الديب ® {new Date().getFullYear()}



تم الإنشاء بكل الحب لطلاب الثانوية العامة



);

}



function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {

return (



{icon}

{title}



{desc}



);

}



function GradeCard({ grade, title, img }: { grade: number, title: string, img: string }) {

return (



{title}



استكشف الآن

);

}



function MotivationCard({ text }: { text: string }) {

return (



{text}

);

}
