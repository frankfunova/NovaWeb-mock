# Staff Attendance 模块数据接口对接文档

本文档详细描述了 **Staff Attendance (员工考勤)** 模块的前端 UI 逻辑与后端接口需求。该模块包含两个核心视图模式（日报模式、工时表模式）以及对应的侧边详情页（Flyout）。

---

## 1. 通用枚举定义 (Shared Enums)

前端筛选和状态展示依赖以下固定值，建议后端保持一致或提供映射。

### 1.1 部门 (Department)
用于列表筛选和用户详情展示。
*   `Toronto Office`
*   `Orlando Operation Team`
*   `Offshore CS Team`
*   `Development Team`

### 1.2 职位 (Position)
用于列表筛选和用户详情展示。
*   `Maintenance`, `Inspector`, `Guest Service`, `Owner Service`, `Office Admin`, `Accountant`, `Dispatcher`, `Cleaner`, `Technician`, `Housekeeper`, `Operator`, `Delivery`

### 1.3 考勤状态 (Attendance Status)
用于列表中的状态标签（Badge）和过滤。
*   `Working` (工作中 - 绿色)
*   `In break` (休息中 - 黄色)
*   `Shift End` (下班/班次结束 - 蓝色)
*   `Off duty` (未排班/休息日 - 灰色)

---

## 2. 考勤列表页面 (Attendance Main Page)

列表页有两个互斥的视图模式：**Daily Report (日报)** 和 **Timesheet (工时表)**。

### 2.1 模式 A: Daily Report (日报视图)
**功能描述**: 展示选定日期（单天）的所有员工考勤概览。
**前端参数**: `date` (ISO Date string, e.g., "2025-11-19")

#### 接口需求字段 (List Item Object)
| 字段名 | 类型 | 必须 | 说明/UI用途 |
| :--- | :--- | :--- | :--- |
| `id` | string | Yes | 记录唯一ID，用于点击打开详情 |
| `userId` | string | Yes | 员工ID |
| `user.fullName` | string | Yes | 显示员工姓名 |
| `user.avatarColor` | string | No | 头像背景色 (如 "bg-indigo-500")，若无头像URL则使用 |
| `user.initials` | string | No | 姓名首字母 (如 "FF") |
| `user.department` | string | Yes | 用于筛选和展示 |
| `user.position` | string | Yes | 用于筛选和展示 |
| `status` | Enum | Yes | 当前实时状态 (`Working`, `Shift End` 等) |
| `firstClockInAt` | ISO String | No | **上班打卡时间**。UI显示为 HH:MM |
| `finalClockOutAt` | ISO String | No | **下班打卡时间**。UI显示为 HH:MM |
| `totalWorkingDurationSec` | number | Yes | **总工作时长(秒)**。UI格式化为 HH:MM |

### 2.2 模式 B: Timesheet (工时表视图)
**功能描述**: 展示选定日期范围（通常为一个月）内员工的累计工时统计。
**前端参数**: `startDate`, `endDate` (ISO Date strings)

#### 接口需求字段 (Summary Item Object)
此模式下的列表项是该员工在该时间段内的**汇总数据**。

| 字段名 | 类型 | 必须 | 说明/UI用途 |
| :--- | :--- | :--- | :--- |
| `userId` | string | Yes | 员工ID |
| `user` | Object | Yes | 包含姓名、部门、职位 (同上) |
| `totalWorkingDurationSec` | number | Yes | 该时间段内的**累计**工作总时长(秒) |
| `start_date` | string | No | 用于显示排班周期的开始 (UI目前复用了Table Header，实际显示的是范围) |
| `end_date` | string | No | 用于显示排班周期的结束 |

> **注意**: Timesheet 模式下，列表不展示具体的 `Clock In/Out` 时间点，而是展示周期汇总。点击行后，在 Flyout 中展示每日明细。

---

## 3. 侧边栏详情 (Flyout Details)

点击列表行时触发。根据当前视图模式，加载不同的详情数据。

### 3.1 场景 A: 单日详情 (Daily Detail / Staff Detail)
**触发条件**: 在 `Daily Report` 模式下点击某员工。
**功能**: 展示该员工当天的详细打卡记录、任务执行情况、效率分析和时间轴。

#### 接口需求: 用户仪表盘数据 (User Dashboard Stats)
建议聚合为一个接口 `/api/staff/{id}/daily-stats?date=...`

**1. 核心统计 (Header Stats)**
| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `totalDuration` | string/number | 当日总工时 (UI: "8:24") |
| `overtimeDuration` | string/number | 加班时长 (UI: "0:24") |
| `payableDuration` | string/number | 计薪时长 (UI: "8:24") |

**2. 打卡记录 (Clock Ins)**
用于处理一天内多次打卡的情况。
```json
"clockIns": [
  { "in": "09:00 AM", "out": "12:00 PM" },
  { "in": "01:00 PM", "out": "05:00 PM" }
]
```

**3. 工作内容分析 (Stats Breakdown)**
用于展示四个方形统计块。
```json
"statsBreakdown": [
  { "label": "Assigned", "time": "5:30", "pct": "65%", "color": "purple" }, // 任务工时
  { "label": "Other", "time": "2:00", "pct": "24%", "color": "slate" },    // 非任务工时
  { "label": "Travel", "time": "0:09", "pct": "2%", "color": "amber" },    // 路程时间
  { "label": "Break", "time": "0:45", "pct": "9%", "color": "rose" }       // 休息时间
]
```

**4. 状态分布 (Status Distribution)**
用于展示分段进度条。
*   数据结构: Map 或 Object，包含 `completed`, `in-progress`, `pending` 等状态对应的工时(秒或小时)。

**5. 活动时间轴 (Activity Timeline)**
用于展示当天的时间流水。
```typescript
interface TimelineEvent {
  type: 'TASK' | 'MEETING' | 'BREAK';
  title: string;       // e.g. "Property Inspection - Unit 305"
  time: string;        // e.g. "9:00 AM - 11:15 AM"
  duration: string;    // e.g. "2:15"
  iconType: 'task' | 'meeting' | 'break';
}
```

---

### 3.2 场景 B: 工时明细 (Timesheet Detail)
**触发条件**: 在 `Timesheet` 模式下点击某员工。
**功能**: 展示该员工在选定月份内，每一天的考勤汇总列表。

#### 接口需求: 个人工时日志 (User Timesheet Logs)
接口: `/api/staff/{id}/timesheet?startDate=...&endDate=...`

**1. 头部汇总 (Summary Header)**
前端会根据返回的日志列表自行计算，或者后端直接返回汇总对象：
*   `daysWorked`: 出勤天数
*   `totalRegular`: 总正常工时
*   `totalOvertime`: 总加班工时
*   `totalPayable`: 总计薪工时

**2. 日志列表 (Daily Log List)**
返回一个数组，包含每一天的记录。

| 字段名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `attendanceDate` | ISO Date | 日期 (用于显示 "Mon, Nov 20") |
| `status` | string | 当天最终状态 (e.g., "Shift End", "Off duty") |
| `regularHours` | string | 正常工时字符串 (e.g. "8:00") |
| `overtimeHours` | string | 加班工时字符串 (e.g. "1:00" 或 "--") |
| `totalHours` | string | 当日总工时 |
| `payableHours` | string | 计薪工时 (通常等于 Total，除非有扣款) |
| `isOff` | boolean | 是否休息日 (UI 显示灰色) |
| `hasWarning` | boolean | 是否有异常 (如缺卡，UI 显示橙色警告图标) |

---

## 4. UI 交互逻辑说明

### 4.1 搜索与筛选
*   **搜索框**: 前端进行**本地过滤**。基于 `fullName`, `department`, `position` 字段进行字符串匹配。
*   **Department/Position 筛选**: 下拉多选。前端基于列表数据中的 `user.department` 和 `user.position` 进行过滤。
*   **Status 筛选**: 仅在 Daily 模式下可用，过滤 `status` 字段。

### 4.2 排序 (Sorting)
*   前端支持对表格列头点击排序。
*   **Clock In/Out 排序**: 基于 ISO 时间戳比较。
*   **Duration 排序**: 基于 `totalWorkingDurationSec` 数值比较。

### 4.3 视图切换
*   切换 Daily/Timesheet 视图时，**必须** 重新请求后端接口，因为数据聚合粒度不同（单日明细 vs 周期汇总）。
*   Timesheet 模式下，日期选择器应表现为“选择月份”或“选择日期范围”，当前 UI 逻辑是“选择某一天则自动选中该月”。