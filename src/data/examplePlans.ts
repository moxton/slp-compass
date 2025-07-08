
import type { ExamplePlan } from "@/types";

export const examplePlans: ExamplePlan[] = [
  {
    disorderArea: "articulation-phonology",
    longTermGoal: "Student will produce target phonemes /r/, /s/, and /th/ with 90% accuracy in conversational speech across multiple settings within 12 months.",
    objectives: [
      "Student will produce /r/ in isolation with 80% accuracy across 3 consecutive sessions",
      "Student will produce /s/ blends in structured words with 85% accuracy in therapy setting",
      "Student will self-monitor and correct /th/ errors in conversational speech with 70% accuracy"
    ],
    treatmentProtocol: {
      duration: "30-45 minute sessions",
      frequency: "2-3 times per week",
      targets: [
        "Correct tongue placement for /r/ production",
        "Airflow control for /s/ and /s/ blends",
        "Visual and auditory discrimination of target sounds",
        "Self-monitoring strategies"
      ],
      references: [
        "Bowen, C. (2015). Children's Speech Sound Disorders. Wiley-Blackwell",
        "ASHA Practice Portal: Speech Sound Disorders-Articulation and Phonology"
      ]
    }
  },
  {
    disorderArea: "fluency",
    longTermGoal: "Student will demonstrate smooth, fluent speech with less than 3% disfluency rate in classroom and social settings within 10 months using learned fluency strategies.",
    objectives: [
      "Student will use easy onset technique in structured sentences with 90% success",
      "Student will implement light articulatory contacts during reading tasks with 85% accuracy",
      "Student will demonstrate smooth speech rate during 5-minute conversations with minimal blocks"
    ],
    treatmentProtocol: {
      duration: "45-60 minute sessions",
      frequency: "2 times per week",
      targets: [
        "Easy onset breathing techniques",
        "Light articulatory contacts",
        "Rate modification strategies",
        "Desensitization and confidence building"
      ],
      references: [
        "Guitar, B. (2019). Stuttering: An Integrated Approach to its Nature and Treatment",
        "Stuttering Foundation of America Clinical Guidelines"
      ]
    }
  },
  {
    disorderArea: "expressive-language",
    longTermGoal: "Student will formulate complex sentences using age-appropriate grammar, vocabulary, and narrative structure with 80% accuracy in academic and social contexts within 12 months.",
    objectives: [
      "Student will produce complete sentences with subject-verb-object structure in 4 out of 5 opportunities",
      "Student will use complex sentence structures including subordinate clauses with 75% accuracy",
      "Student will tell coherent 5-sentence narratives with clear beginning, middle, and end"
    ],
    treatmentProtocol: {
      duration: "45 minute sessions",
      frequency: "2-3 times per week",
      targets: [
        "Sentence expansion techniques",
        "Vocabulary development and word retrieval",
        "Narrative story grammar elements",
        "Question formulation and response skills"
      ],
      references: [
        "Paul, R. & Norbury, C. (2012). Language Disorders from Infancy through Adolescence",
        "ASHA Evidence Maps: Language Intervention"
      ]
    }
  },
  {
    disorderArea: "social-pragmatics",
    longTermGoal: "Student will demonstrate appropriate social communication skills including turn-taking, topic maintenance, and nonverbal communication with 85% success in peer interactions within 10 months.",
    objectives: [
      "Student will initiate and maintain conversations for 3-4 exchanges with peers",
      "Student will interpret and use appropriate nonverbal cues (eye contact, gestures) in 4 out of 5 interactions",
      "Student will demonstrate perspective-taking skills by identifying others' emotions and intentions"
    ],
    treatmentProtocol: {
      duration: "45-60 minute sessions",
      frequency: "2 times per week",
      targets: [
        "Conversation initiation and maintenance",
        "Nonverbal communication interpretation",
        "Social problem-solving strategies",
        "Perspective-taking and theory of mind"
      ],
      references: [
        "Winner, M.G. (2007). Thinking About YOU Thinking About ME",
        "Social Thinking Methodology and ASHA Social Communication Guidelines"
      ]
    }
  }
];
