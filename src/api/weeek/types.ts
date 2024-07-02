import { z } from "zod";

type TWeekAPIResponse<T extends Record<string, unknown>> = {
  success: false;
  message: string;
} | ({
  success: true;
} & T);

type ProjectCustomField = {
  id: string;
  name?: string;
  type: string;
  config?: {
    type: string;
  };
  options: {
    id: string;
    name: string;
    color: string;
  }[];
}

type Project = {
  id: number;
  title: string;
  logoLink?: string;
  description?: string;
  color: string;
  isPrivate: boolean;
  team: string[];
  customFields: ProjectCustomField[];
}

type Board = {
  id: number;
  name: string;
  projectId: number;
  isPrivate: boolean;
}

type BoardColumn = {
  id: number;
  name: string;
  boardId: number;
}


type WorkLoad = {
  id: string;
  userId: string;
  type: 1 | 2;
  date: string;
  duration: number;
  workStartAt?: string;
  workEndAt?: string;
}

type TimeEntry = {
  id: string;
  userId: string;
  type: 1 | 2;
  isOvertime?: boolean;
  date: `${number}-${number}-${number}`;
  duration: number;
}

type Attachment = {
  id: string;
  creatorId: string;
  service: "week" | "google_drive" | "dropbox" | "one_drive" | "box";
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export type Task = {
  id: number;
  parentId?: number;
  title: string;
  description?: string;
  duration?: number;
  type: "action" | "meet" | "call";
  priority: 0 | 1 | 2 | 3;
  isCompleted: boolean;
  authorId: string;
  userId?: string;
  boardId: number;
  boardColumnId: number;
  projectId: number;
  image?: string;
  isPrivate: boolean;
  startDate?: `${number}-${number}-${number}`;
  startDateTime?: string;
  dueDate?: `${number}-${number}-${number}`;
  dueDateTime?: string;
  createdAt?: string;
  updatedAt?: string;
  tags: number[];
  subscribers: string[];
  subTasks: number[];
  workloads: WorkLoad[];
  timeEntries: TimeEntry[];
  customFields: unknown;
  attachments: Attachment[];
}

type Member = {
  id: string;
  email: string;
  logo?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  position?: string;
  timeZone: string;
}

export type GetProjectsListData = TWeekAPIResponse<{ projects: Project[]; }>
export type GetBoardListData = TWeekAPIResponse<{ boards: Board[]; }>
export type GetBoardColumnListData = TWeekAPIResponse<{ boardColumns: BoardColumn[]; }>
export type GetBoardColumnTaskList = TWeekAPIResponse<{ tasks: Task[]; hasMore: boolean; }>
export type GetBoardTask = TWeekAPIResponse<{ task: Task; }>
export type GetWorkspaceMembers = TWeekAPIResponse<{ members: Member[]; }>

export type GetWeekComments = {
  comments: {
    id: number;
    parentId: number;
    content: unknown;
  }
}

export const weekTextMarksSchema = z.array(z.discriminatedUnion("type", [
  z.object({
   type: z.literal("bold")
  }), 
  z.object({
   type: z.literal("italic")
  }), 
  z.object({
   type: z.literal("underline")
  }), 
  z.object({
   type: z.enum(["strike", "line-through"])
  }),
 ]
).or(z.object({
 type: z.string(),
})))

export const weeekParagraphSchema = z.object({
  type: z.literal("paragraph"),
  content: z.array(z.discriminatedUnion("type", [
    z.object({
      type: z.literal("text"),
      text: z.string(),
      marks: weekTextMarksSchema.optional()
    }),
    z.object({
      type: z.literal("mention"),
    }),
    z.object({
      type: z.literal("line_break"),
    }),
  ])).optional()
});

export const weeekHeadingSchema = z.object({
  type: z.literal("heading"),
  attrs: z.object({
    level: z.number()
  }),
  content: z.array(
      z.object({
        type: z.literal("text"),
        text: z.string()
      })
    )
});

const weeekFileSchema = z.object({
  type: z.enum(["image", "file", "video"]),
  attrs: z.object({
    name: z.string()
  })
})

export const weeekListSchema = z.object({
  type: z.enum(["ordered_list", "bullet_list"]),
  content: z.array(
    z.object({
      type: z.literal("list_item"),
      content: z.array(
        z.object({
          type: z.literal("text"),
          text: z.string()
        })
      )
    })
  )
})

const weeekHrSchema = z.object({
  type: z.literal("hr"),
})

const weeekCodeSchema = z.object({
  type: z.literal("code"),
  content: z.array(z.discriminatedUnion("type", [
    z.object({
      type: z.literal("text"),
      text: z.string()
    })
  ]))
})

const weeekCalloutSchema = z.object({
  type: z.literal("colout"),
  content: z.array(z.discriminatedUnion("type", [
    weeekParagraphSchema,
    weeekFileSchema,
    weeekListSchema,
    weeekHeadingSchema,
    weeekHrSchema,
    weeekCodeSchema,
    z.object({
      type: z.literal("colout"),
      content: z.any()
    }),
    z.object({
      type: z.literal("task_list"),
      content: z.any()
    }),
    z.object({
      type: z.literal("toggle_list"),
      content: z.any()
    }),
    z.object({
      type: z.literal("table"),
      content: z.any()
    }),
  ])).nullish()
})

const weekToggleListSchema = z.object({
  type: z.literal("toggle_list"),
  content: z.array(
    z.object({
      type: z.literal("toggle_list_item"),
      attrs: z.object({
        open: z.boolean()
      }),
      content: z.array(
        z.discriminatedUnion("type", [
            z.object({
              type: z.literal("toggle_list_paragraph"),
              content: z.array(z.object({
                type: z.literal("text"),
                text: z.string()
              })),
            }),
            z.object({
              type: z.literal("toggle_list_content"),
              content: z.array(z.discriminatedUnion("type", [
                weeekParagraphSchema,
                weeekFileSchema,
                weeekListSchema,
                weeekHeadingSchema,
                weeekHrSchema,
                weeekCalloutSchema,
                weeekCodeSchema,
                z.object({
                  type: z.literal("task_list"),
                  content: z.any()
                }),
                z.object({
                  type: z.literal("toggle_list"),
                  content: z.any()
                }),
                z.object({
                  type: z.literal("table"),
                  content: z.any()
                }),
              ])),
            }),
          ])
        )
    })
  ).nullish()
})

const weekTaskListSchema = z.object({
  type: z.literal("task_list"),
  content: z.array(
    z.object({
      type: z.literal("task_item"),
      attrs: z.object({
        checked: z.boolean()
      }),
      content: z.array(z.discriminatedUnion("type", [
        weeekParagraphSchema,
        weeekFileSchema,
        weeekListSchema,
        weeekHeadingSchema,
        weeekHrSchema,
        weeekCalloutSchema,
        weeekCodeSchema,
        weekToggleListSchema,
        z.object({
          type: z.literal("task_list"),
          content: z.any()
        }),
        z.object({
          type: z.literal("table"),
          content: z.any()
        }),
      ])),
    })
  ).nullish()
})

export const weeekTableSchema = z.object({
  type: z.literal("table"),
  content: z.array(
    z.object({
      type: z.literal("table_row"),
      content: z.array(
        z.object({
          type: z.literal("table_cell"),
          attrs: z.object({
            colspan: z.number(),
            rowspan: z.number(),
          }),
          content: z.array(z.discriminatedUnion("type", [
            weeekParagraphSchema,
            weeekFileSchema,
            weeekListSchema,
            weeekHeadingSchema,
            weekToggleListSchema,
            weekTaskListSchema,
            weeekHrSchema,
            weeekCodeSchema,
            weeekCalloutSchema,
            z.object({
              type: z.literal("table"),
              content: z.any()
            })
          ]))
        })
      )
    })).nullish()
})

export const weeekContentArraySchema = z.array(z.discriminatedUnion("type", [
  weeekParagraphSchema,
  weeekFileSchema,
  weeekListSchema,
  weeekHeadingSchema,
  weekToggleListSchema,
  weekTaskListSchema,
  weeekHrSchema,
  weeekCodeSchema,
  weeekTableSchema,
  weeekCalloutSchema
]))

export const getWeeekCommentsSchema = z.object({
  task: z.object({
    comments: z.array(
      z.object({
        id: z.number(),
        content: z.object({
          data: z.object({
            type: z.literal("doc"),
            content: weeekContentArraySchema
          })
        }),
        user: z.object({
          id: z.string(),
          name: z.string()
        })
      })
    )
  })
})

export type WeeekComment = z.infer<typeof weeekContentArraySchema>

export type GetWeeekComments = TWeekAPIResponse<z.infer<typeof getWeeekCommentsSchema>>