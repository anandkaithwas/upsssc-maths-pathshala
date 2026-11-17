import React,{useMemo,useState} from "react";
import {jsPDF} from "jspdf";
import "./worksheet-generator.css";

const bank={
  गणित:[
    {q:"240 का 25% कितना है?",o:["40","50","60","80"],a:2,e:"25% = 1/4; 240 ÷ 4 = 60."},
    {q:"यदि 3 : 5 = x : 20, तो x क्या है?",o:["10","12","15","18"],a:1,e:"x = 3 × 20 ÷ 5 = 12."},
    {q:"₹800 की वस्तु ₹920 में बेची। लाभ प्रतिशत?",o:["10%","12%","15%","20%"],a:2,e:"लाभ ₹120; 120 ÷ 800 × 100 = 15%."},
    {q:"480 का 15% कितना है?",o:["62","68","72","75"],a:2,e:"10% = 48 और 5% = 24; कुल 72."},
    {q:"12, 18 और 30 का HCF क्या है?",o:["3","6","9","12"],a:1,e:"तीनों का सबसे बड़ा समान भाजक 6 है."},
    {q:"3/4 को प्रतिशत में लिखें।",o:["25%","50%","75%","80%"],a:2,e:"3 ÷ 4 × 100 = 75%."},
    {q:"₹500 पर 10% छूट के बाद मूल्य?",o:["₹400","₹450","₹475","₹490"],a:1,e:"छूट ₹50; देय मूल्य ₹450."},
    {q:"यदि किसी संख्या का 20% = 40 है, संख्या क्या है?",o:["100","160","200","240"],a:2,e:"संख्या = 40 × 100 ÷ 20 = 200."}
  ],
  रीजनिंग:[
    {q:"श्रृंखला पूरी करें: 2, 6, 12, 20, 30, ?",o:["36","40","42","44"],a:2,e:"अंतर 4, 6, 8, 10; अगला 12, इसलिए 42."},
    {q:"CAT को DBU लिखा जाता है, तो DOG कैसे लिखा जाएगा?",o:["EPH","EOG","FPH","DPH"],a:0,e:"हर अक्षर के बाद वाला अक्षर लिया गया है."},
    {q:"इनमें से अलग कौन है?",o:["वर्ग","आयत","त्रिभुज","घन"],a:3,e:"घन 3-D आकृति है; शेष 2-D हैं."},
    {q:"श्रृंखला: 5, 10, 20, 40, ?",o:["60","70","80","100"],a:2,e:"हर पद दोगुना है; 40 × 2 = 80."},
    {q:"यदि A=1, B=2, तो D का मान?",o:["2","3","4","5"],a:2,e:"अंग्रेज़ी वर्णमाला में D चौथा अक्षर है."}
  ],
  हिंदी:[
    {q:"‘अग्नि’ का पर्यायवाची शब्द?",o:["अनल","पवन","अंबर","नीर"],a:0,e:"अनल का अर्थ अग्नि है."},
    {q:"‘उन्नति’ का विलोम?",o:["प्रगति","अवनति","विकास","समृद्धि"],a:1,e:"अवनति का अर्थ पतन है."},
    {q:"‘नीलकमल’ में कौन-सा समास है?",o:["द्वंद्व","कर्मधारय","बहुव्रीहि","द्विगु"],a:1,e:"नीला है जो कमल — विशेषण-विशेष्य संबंध."},
    {q:"‘जल’ का पर्यायवाची कौन-सा है?",o:["अनल","नीर","गगन","पवन"],a:1,e:"नीर जल का पर्यायवाची है."},
    {q:"‘लाभ’ का विलोम शब्द?",o:["आय","हानि","वृद्धि","धन"],a:1,e:"हानि, लाभ का विलोम है."}
  ],
  "सामान्य अध्ययन":[
    {q:"भारतीय संविधान कब अंगीकृत हुआ?",o:["15 अगस्त 1947","26 जनवरी 1950","26 नवंबर 1949","2 अक्टूबर 1949"],a:2,e:"संविधान 26 नवंबर 1949 को अंगीकृत हुआ."},
    {q:"सौरमंडल का सबसे बड़ा ग्रह?",o:["शनि","पृथ्वी","बृहस्पति","मंगल"],a:2,e:"बृहस्पति सौरमंडल का सबसे बड़ा ग्रह है."},
    {q:"भारत का राष्ट्रीय पशु कौन है?",o:["सिंह","बाघ","हाथी","हिम तेंदुआ"],a:1,e:"भारत का राष्ट्रीय पशु बाघ है."},
    {q:"उत्तर प्रदेश की राजधानी?",o:["प्रयागराज","कानपुर","वाराणसी","लखनऊ"],a:3,e:"उत्तर प्रदेश की राजधानी लखनऊ है."},
    {q:"भारत का संविधान कब लागू हुआ?",o:["26 नवंबर 1949","15 अगस्त 1947","26 जनवरी 1950","2 अक्टूबर 1950"],a:2,e:"संविधान 26 जनवरी 1950 को लागू हुआ."}
  ]
};
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;};
const makeMathVariant=(level,i)=>{
 const base=[{n:120,p:25},{n:360,p:15},{n:640,p:12.5},{n:800,p:7.5},{n:450,p:20},{n:720,p:5},{n:960,p:12.5},{n:560,p:15},{n:240,p:35},{n:1250,p:8}][i%10];
 const n=base.n+(level==="challenging"?i*10:0), p=base.p;
 const answer=n*p/100, opts=[answer,answer+5,answer-5,answer+10].map(v=>Number(v.toFixed(2)));
 const order=shuffle(opts), correct=order.indexOf(Number(answer.toFixed(2)));
 return {q:`${n} का ${p}% कितना है?`,o:order.map(v=>String(v)),a:correct,e:`${p}% = ${p/100}; ${n} × ${p/100} = ${answer}.`,level};
};
function buildQuestions(subject,count,adaptive){
 const names=subject==="मिश्रित"?Object.keys(bank):[subject];
 const pool=shuffle(names.flatMap(name=>bank[name].map(q=>({...q,subject:name,level:"basic"}))));
 const output=[];
 for(let i=0;i<count;i++){
   const ratio=(i+1)/count;
   const level=ratio<=.34?"basic":ratio<=.67?"moderate":"challenging";
   if(subject==="गणित"||subject==="मिश्रित"&&i%4===0){
     output.push({...makeMathVariant(level,i),subject:"गणित",level,source:"generated-variation"});
   }else{
     const candidates=pool.filter(q=>!output.some(x=>x.q===q.q));
     const pick=candidates[0]||pool[i%pool.length];
     output.push({...pick,level,source:"verified-bank"});
   }
 }
 return output;
}
export default function WorksheetGenerator({user}){
 const [subject,setSubject]=useState("मिश्रित"),[count,setCount]=useState(30),[busy,setBusy]=useState(false),[notice,setNotice]=useState(""),[lastScore,setLastScore]=useState(0);
 const [answers,setAnswers]=useState({});
 const freeLimit=30;
 const generate=()=>{
   setBusy(true);setNotice("");
   try{
     const history=Number(localStorage.getItem("ump-worksheet-score")||0);
     const adaptive=history>=75?"challenging":history<40?"basic":"moderate";
     const qs=buildQuestions(subject,Math.min(count,freeLimit),adaptive);
     const doc=new jsPDF({unit:"mm",format:"a4"});
     doc.setFont("helvetica","bold");doc.setFontSize(18);doc.text("UPSSSC MATHS PATHSHALA",14,18);
     doc.setFont("helvetica","normal");doc.setFontSize(10);doc.text("Practice Worksheet | Mixed difficulty | 30-question default",14,25);
     doc.text(`Subject: ${subject}   Questions: ${qs.length}   Date: ${new Date().toLocaleDateString("en-IN")}`,14,32);
     let y=42;
     qs.forEach((q,i)=>{
       const lines=doc.splitTextToSize(`${i+1}. [${q.level.toUpperCase()}] ${q.q}`,180);
       if(y+lines.length*5+25>280){doc.addPage();y=18;}
       doc.setFont("helvetica","bold");doc.setFontSize(10);doc.text(lines,14,y);y+=lines.length*5;
       doc.setFont("helvetica","normal");doc.setFontSize(9);
       q.o.forEach((o,j)=>{doc.text(`${String.fromCharCode(65+j)}. ${o}`,19,y);y+=4.5;});
       y+=2;
     });
     doc.addPage();y=18;doc.setFont("helvetica","bold");doc.setFontSize(15);doc.text("Answer Key & Solutions",14,y);y+=10;
     qs.forEach((q,i)=>{
       const line=doc.splitTextToSize(`${i+1}. Answer: ${q.o[q.a]} — ${q.e}`,180);
       if(y+line.length*5>280){doc.addPage();y=18;}
       doc.setFont("helvetica","normal");doc.setFontSize(9);doc.text(line,14,y);y+=line.length*5+3;
     });
     doc.save(`UPSSSC-Worksheet-${subject.replace(/[^\p{L}\p{N}]+/gu,"-")}-${Date.now()}.pdf`);
     setNotice("PDF तैयार है। इसमें प्रश्न और समाधान एक ही फ़ाइल में हैं।");
     localStorage.setItem("ump-worksheet-last-subject",subject);
   }catch(error){setNotice("PDF नहीं बन सकी। कृपया दोबारा प्रयास करें।");}
   finally{setBusy(false);}
 };
 return <div className="worksheet-panel"><div className="eyebrow">AUTOMATED PRACTICE BUILDER</div><h2>अपनी PDF Worksheet बनाएं</h2><p>विषय चुनें, प्रश्नों की संख्या तय करें और डाउनलोड करें। उत्तर व समाधान उसी PDF में मिलेंगे।</p><div className="worksheet-controls"><label>विषय<select value={subject} onChange={e=>setSubject(e.target.value)}><option>मिश्रित</option>{Object.keys(bank).map(x=><option key={x}>{x}</option>)}</select></label><label>प्रश्नों की संख्या<select value={count} onChange={e=>setCount(Number(e.target.value))}>{[10,20,30].map(n=><option key={n} value={n}>{n} प्रश्न</option>)}</select></label></div><div className="difficulty-track"><span>आसान</span><i/><span>मध्यम</span><i/><span>चुनौतीपूर्ण</span></div><div className="worksheet-meta"><span>✓ कठिनाई क्रमशः बढ़ेगी</span><span>✓ Freemium: 30 प्रश्न तक मुफ़्त</span><span>✓ प्रश्न + समाधान एक PDF में</span></div><button className="btn primary" type="button" disabled={busy} onClick={generate}>{busy?"PDF तैयार हो रही है…":"PDF Worksheet डाउनलोड करें ↓"}</button>{notice&&<p className="worksheet-notice" role="status">{notice}</p>}<small className="worksheet-disclaimer">नोट: वर्तमान hybrid mode सत्यापित स्थिर प्रश्न बैंक और नियम-आधारित गणित variations का उपयोग करता है। बाहरी AI API/paid premium entitlement अभी configure नहीं है; PYQ के रूप में AI-generated प्रश्न प्रस्तुत नहीं किए जाते।</small></div>;
}
