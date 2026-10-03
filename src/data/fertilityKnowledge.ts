export interface SymptomOption {
  id: string;
  nameAr: string;
  category: 'pelvic' | 'body' | 'digestive' | 'skin_head' | 'sleep_energy';
  categoryLabelAr: string;
  descriptionAr: string;
}

export const AVAILABLE_SYMPTOMS: SymptomOption[] = [
  { id: 'cramps_mild', nameAr: 'تقلصات رحمية خفيفة', category: 'pelvic', categoryLabelAr: 'الحوض والرحم', descriptionAr: 'وخز أو شد أسفل البطن خفيف ومحتمل' },
  { id: 'cramps_severe', nameAr: 'مغص طمثي شديد', category: 'pelvic', categoryLabelAr: 'الحوض والرحم', descriptionAr: 'تقلصات حادة تعيق الحركة أو النشاط اليومي' },
  { id: 'ovulation_pain', nameAr: 'نغزات التبويض (Mittelschmerz)', category: 'pelvic', categoryLabelAr: 'الحوض والرحم', descriptionAr: 'ألم مفاجئ في أحد جانبي أسفل البطن قرب المبيض' },
  { id: 'pelvic_heaviness', nameAr: 'ثقل أو ضغط بالحوض', category: 'pelvic', categoryLabelAr: 'الحوض والرحم', descriptionAr: 'شعور بالاحتقان في منطقة أسفل الحوض' },

  { id: 'breast_tenderness', nameAr: 'ألم وحساسية الثديين', category: 'body', categoryLabelAr: 'الجسم والعضلات', descriptionAr: 'احتقان أو تورم طفيف في الثديين شائع قبل الحيض' },
  { id: 'lower_back_pain', nameAr: 'ألم أسفل الظهر', category: 'body', categoryLabelAr: 'الجسم والعضلات', descriptionAr: 'ألم ممتد من عضلات أسفل الظهر نحو الوركين' },
  { id: 'joint_muscle_ache', nameAr: 'آلام المفاصل والعضلات', category: 'body', categoryLabelAr: 'الجسم والعضلات', descriptionAr: 'إجهاد عام أو تيبس طفيف في الأطراف' },

  { id: 'bloating', nameAr: 'انتفاخ وغازات البطن', category: 'digestive', categoryLabelAr: 'الجهاز الهضمي', descriptionAr: 'احتباس السوائل وتمدد جدار البطن' },
  { id: 'nausea', nameAr: 'غثيان أو نفور من الروائح', category: 'digestive', categoryLabelAr: 'الجهاز الهضمي', descriptionAr: 'شعور بالانزعاج المعدي أو الدوخة' },
  { id: 'cravings_sweet', nameAr: 'اشتهاء الحلويات والسكريات', category: 'digestive', categoryLabelAr: 'الجهاز الهضمي', descriptionAr: 'رغبة ملحة في الشوكولاتة والنشويات' },
  { id: 'constipation_diarrhea', nameAr: 'إمساك أو إسهال هرموني', category: 'digestive', categoryLabelAr: 'الجهاز الهضمي', descriptionAr: 'تغير في حركة الأمعاء بفعل البروجستيرون أو البروستاغلاندين' },

  { id: 'headache_migraine', nameAr: 'صداع نصفي أو هرموني', category: 'skin_head', categoryLabelAr: 'الرأس والبشرة', descriptionAr: 'صداع نابض متكرر قرب تغيرات الإستروجين' },
  { id: 'acne_breakout', nameAr: 'حب الشباب الهرموني', category: 'skin_head', categoryLabelAr: 'الرأس والبشرة', descriptionAr: 'بثور تتركز في منطقة الفك والذقن' },
  { id: 'hot_flashes', nameAr: 'هبات ساخنة أو تعرق', category: 'skin_head', categoryLabelAr: 'الرأس والبشرة', descriptionAr: 'شعور مفاجئ بالدفء خاصة أثناء النوم' },

  { id: 'fatigue_exhaustion', nameAr: 'إرهاق وخمول بدني', category: 'sleep_energy', categoryLabelAr: 'الطاقة والنوم', descriptionAr: 'شعور بانخفاض الطاقة وصعوبة أداء المهام' },
  { id: 'insomnia', nameAr: 'أرق وصعوبة استغراق بالنوم', category: 'sleep_energy', categoryLabelAr: 'الطاقة والنوم', descriptionAr: 'استيقاظ متكرر في النصف الثاني من الدورة' },
  { id: 'high_energy', nameAr: 'طاقة ونشاط عالي', category: 'sleep_energy', categoryLabelAr: 'الطاقة والنوم', descriptionAr: 'حيوية وتركيز ممتازين في الطور الجريبي وحول الإباضة' },
];

export const AVAILABLE_MOODS = [
  { id: 'calm', labelAr: 'هادئة ومتوازنة', emoji: '🌸' },
  { id: 'happy', labelAr: 'سعيدة ومتفائلة', emoji: '✨' },
  { id: 'energetic', labelAr: 'متحمسة ومنتجة', emoji: '⚡' },
  { id: 'sensitive', labelAr: 'حساسة عاطفياً', emoji: '💧' },
  { id: 'anxious', labelAr: 'قلقة أو متوترة', emoji: '🌪️' },
  { id: 'irritable', labelAr: 'سريعة الانفعال', emoji: '⚡' },
  { id: 'sad', labelAr: 'حزينة أو مكتئبة', emoji: '🌧️' },
  { id: 'low_focus', labelAr: 'تشتت وضبابية التفكير', emoji: '🌫️' }
];

export const CERVICAL_MUCUS_GUIDE = [
  {
    type: 'dry',
    titleAr: 'جاف أو غير ملحوظ',
    timingAr: 'مباشرة بعد انتهاء دم الحيض',
    fertilityScoreAr: 'احتمالية حمل ضعيفة جداً',
    fertilityBadge: 'low',
    descriptionAr: 'لا يوجد بلل أو مخاط ملحوظ في الفرج، وتعتبر البيئة المهبلية حمضية ومعيقة لحركة الحيوانات المنوية.'
  },
  {
    type: 'sticky',
    titleAr: 'دبق أو لزج سميك',
    timingAr: 'في بداية الطور الجريبي (اليوم 6 - 9)',
    fertilityScoreAr: 'احتمالية حمل منخفضة',
    fertilityBadge: 'low',
    descriptionAr: 'مخاط أبيض أو مائل للصفرة يتكسر ولا يتمدد، يشكل سداً طبيعياً لعنق الرحم لمنع مرور الجراثيم والحيوانات المنوية.'
  },
  {
    type: 'creamy',
    titleAr: 'كريمي يشبه اللوشن',
    timingAr: 'منتصف الطور الجريبي (اليوم 10 - 11)',
    fertilityScoreAr: 'احتمالية حمل متوسطة (بداية الخصوبة)',
    fertilityBadge: 'medium',
    descriptionAr: 'مخاط ناعم ورطب يشبه مرطب البشرة، يبدأ بتهيئة بيئة أكثر قلوية لاستقبال الحيوانات المنوية وبدء فترة الخصوبة.'
  },
  {
    type: 'watery',
    titleAr: 'مائي رطب وشفاف',
    timingAr: 'قبل الإباضة بيومين (اليوم 12 - 13)',
    fertilityScoreAr: 'احتمالية حمل مرتفعة',
    fertilityBadge: 'high',
    descriptionAr: 'سوائل شفافة خفيفة تسبب بللاً واضحاً في الملابس الداخلية، وتسمح بمرور سريع للحيوانات المنوية نحو الرحم.'
  },
  {
    type: 'egg_white',
    titleAr: 'زلال البيض النيء (مطاطي فائق الخصوبة)',
    timingAr: 'يوم الإباضة واليوم السابق له مباشرة',
    fertilityScoreAr: 'أقصى ذروة للخصوبة (Peak Fertility)',
    fertilityBadge: 'peak',
    descriptionAr: 'مخاط شفاف زلق وقابل للتمدد حتى عدة سنتيمترات بين أصابعك دون انقطاع. يحتوي على قنوات مجهرية توجه الحيوانات المنوية مباشرة للبويضة وتغذيها لعدة أيام.'
  }
];

export const PREGNANCY_WEEK_MILESTONES = [
  {
    weekRange: 'الأسبوع 1 - 2',
    title: 'مرحلة التجهيز والإباضة',
    fetalSize: 'حبة مجهرية (البويضة المحررة)',
    hCGExpected: 'أقل من 5 mIU/mL',
    clinicalDescription: 'يبدأ الحساب الطبي للحمل من أول يوم لآخر دورة شهرية. في نهاية الأسبوع الثاني يحدث التبويض ويتم إخصاب البويضة لتشكل الزيجوت.'
  },
  {
    weekRange: 'الأسبوع 3 - 4',
    title: 'الانغراس وبداية إفراز هرمون الحمل',
    fetalSize: 'بذرة خشخاش (1 ملم)',
    hCGExpected: '5 - 50 mIU/mL',
    clinicalDescription: 'تصل الكيسة الأريمية للرحم وتنغرس في البطانة. قد تلاحظين قطرات دم انغراس خفيفة ويبدأ فحص الحمل المنزلي بالتحول للإيجابي.'
  },
  {
    weekRange: 'الأسبوع 5 - 6',
    title: 'تكوين الأنبوب العصبي وأول نبض للقلب',
    fetalSize: 'حبة سمسم إلى بذرة عدس (4 - 6 ملم)',
    hCGExpected: '200 - 7,000 mIU/mL',
    clinicalDescription: 'يبدأ قلب الجنين الصغير بالنبض بسرعة 110-160 نبضة بالدقيقة. يبدأ الأنبوب العصبي (الدماغ والحبل الشوكي) بالتكون وتزداد أهمية حمض الفوليك.'
  },
  {
    weekRange: 'الأسبوع 7 - 8',
    title: 'ظهور براعم الأطراف وتمايز ملامح الوجه',
    fetalSize: 'حبة توت بري (13 - 16 ملم)',
    hCGExpected: '7,000 - 56,000 mIU/mL',
    clinicalDescription: 'تتشكل أصابع اليدين والقدمين والجفون. تعاني الأم من ذروة أعراض الوحام والغثيان الصباحي نتيجة وصول هرمونات hCG و البروجستيرون لمستويات قياسية.'
  },
  {
    weekRange: 'الأسبوع 9 - 12',
    title: 'اكتمال الأعضاء الحيوية ونهاية الثلث الأول',
    fetalSize: 'حبة ليمونة كاملة (5 - 6 سم)',
    hCGExpected: '25,000 - 288,000 mIU/mL',
    clinicalDescription: 'يكتمل تشكل المشيمة لتتولى إمداد الجنين بالغذاء والأكسجين بدلاً من الجسم الأصفر. تقل مخاطر الإجهاض بنسبة 85% ويصبح نبض الجنين مسموعاً عبر الدوبلر الصوتي.'
  }
];

export const CLINICAL_FAQS = [
  {
    q: 'كم يوماً تعيش البويضة وكم يعيش الحيوان المنوي؟',
    a: 'تعيش البويضة البشرية بين 12 إلى 24 ساعة فقط بعد انطلاقها من المبيض، بينما تستطيع الحيوانات المنوية البقاء حية وخصبة داخل المخاط التناسلي المواتي لمدة تصل إلى 5 أيام (120 ساعة). لذلك فإن الجماع قبل الإباضة بيومين أو ثلاثة يرفع فرص الحمل أكثر من الجماع بعد خروج البويضة.'
  },
  {
    q: 'هل يمكن أن يحدث الحمل مباشرة بعد انتهاء الدورة الشهرية؟',
    a: 'نعم ممكن، خاصة لدى النساء ذوات الدورات الشهرية القصيرة (مثلاً 21 إلى 24 يوماً). إذا استمر الحيض 6 أيام وحدث التبويض في اليوم العاشر، فإن الجماع في اليوم السابع أو الثامن قد يؤدي إلى تخصيب البويضة بسبب بقاء الحيوان المنوي حياً لعدة أيام.'
  },
  {
    q: 'ما هو المقياس الطبي لاعتبار الدورة غير منتظمة؟',
    a: 'تُعتبر الدورة غير منتظمة سريرياً إذا كان الفارق بين أقصر دورة وأطول دورة يزيد عن 8 إلى 9 أيام خلال عام كامل، أو إذا كانت مدة الدورة تقل دائماً عن 21 يوماً أو تزيد عن 35 يوماً. يستدعي ذلك فحص هرمونات الغدة الدرقية، هرمون الحليب (البرولاكتين)، وسونار المبايض لاستبعاد التكيس.'
  },
  {
    q: 'لماذا ترتفع درجة حرارة الجسم الأساسية (BBT) بعد التبويض؟',
    a: 'بعد خروج البويضة، يتحول الجريب المتبقي إلى الجسم الأصفر الذي يبدأ فوراً بضخ هرمون البروجستيرون في مجرى الدم. هرمون البروجستيرون يؤثر مباشرة على مركز تنظيم الحرارة في الدماغ مسبباً ارتفاعاً ثابتاً في درجة حرارة الجسم بمقدار 0.2 إلى 0.5 مئوية طوال النصف الثاني حتى موعد الدورة التالية.'
  },
  {
    q: 'متى يعتبر النزيف غير طبيعي ويستلزم فحصاً فورياً؟',
    a: 'إذا كان النزيف غزيراً لدرجة ملء فوطة صحية كاملة كل ساعة لمدة ساعتين متتاليتين، أو خروج كتل دموية متجلطة كبيرة، أو استمرار النزف أكثر من 8 أيام، أو نزول الدم بعد العلاقة الزوجية مباشرة، أو أي نزيف بعد انقطاع الطمث التام سن اليأس.'
  }
];
