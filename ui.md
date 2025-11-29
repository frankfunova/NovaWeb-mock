# Intent Detail: 关联模块 UI 规范文档

本文档详细描述了 **Intent Detail Flyout** 中 `Linked Reservation` 和 `Linked Tasks` 两个折叠面板（Collapsible Sections）的 UI 设计规范。

## 1. Linked Reservation (关联预订)

该模块用于展示与当前 Intent（意图/请求）相关联的预订信息。如果尚未关联，则提供搜索/关联入口。

### 1.1 容器结构
*   **组件类型**: `CollapsibleSection`
*   **标题**: "Linked Reservation"
*   **头部图标**: `Icons.Calendar` (`w-3.5 h-3.5 text-slate-400`)
*   **头部动作 (Action)**:
    *   **未进入编辑模式时**: 显示 "Link Reservation" (或 "Change") 按钮。
        *   样式: `text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded`。

### 1.2 状态 A: 编辑/搜索模式 (Linking Mode)
当用户点击头部动作按钮时，内容区域变为搜索表单。

*   **布局**: Flex Row (`flex gap-2 items-center`)。
*   **输入框 (Input)**:
    *   占满剩余空间 (`flex-1`).
    *   样式: `text-sm border border-slate-300 rounded-lg px-3 py-2`.
    *   Placeholder: "Enter Reservation ID or Confirmation Code..."
    *   Focus态: `ring-2 ring-indigo-500`.
*   **保存按钮 (Save)**:
    *   样式: `bg-indigo-600 text-white text-sm font-bold rounded-lg px-3 py-2`.
*   **取消按钮 (Cancel)**:
    *   样式: `bg-white border border-slate-300 text-slate-600 text-sm font-bold rounded-lg px-3 py-2`.

### 1.3 状态 B: 已关联卡片 (Card View)
当存在关联数据 (`intent.reservation`) 时展示的卡片。

*   **外框**:
    *   背景: `bg-white`
    *   边框: `border border-slate-200`
    *   圆角: `rounded-lg`
    *   内边距: `p-3`
    *   交互: `hover:border-indigo-300` (悬停变色)，点击触发跳转。
*   **布局**: Flex Row (`justify-between`)，分为左侧信息区和右侧状态区。

#### 左侧信息区 (Info Block)
包含图标和文本信息。
1.  **图标**:
    *   容器: `p-2 bg-slate-100 rounded-lg`.
    *   图标: `Icons.User` (`text-slate-500`).
    *   交互: 整个卡片悬停时，图标容器变为 `bg-indigo-50`，图标变为 `text-indigo-600`。
2.  **文本内容**:
    *   **第一行 (Guest & Code)**:
        *   客人姓名: `text-sm font-medium text-slate-800`.
        *   预订号: 显示在姓名后，`text-xs text-slate-400 font-normal`，前缀 `#` (例如 `HMQ823JKS`).
    *   **第二行 (Date Range)**:
        *   样式: `text-xs text-slate-500 mt-0.5`.
        *   内容: 日期范围字符串 (例如 "Nov 19 - Nov 24, 2025").

#### 右侧状态区 (Status Block)
1.  **状态标签 (Badge)**:
    *   样式: `px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize`.
    *   配色: `bg-slate-50 text-slate-600 border-slate-200` (源码中统一使用了灰色系，未根据状态变色).
2.  **箭头图标**:
    *   图标: `Icons.ChevronRight`.
    *   颜色: `text-slate-400`.
    *   交互: 卡片悬停时变为 `text-indigo-500`.

### 1.4 状态 C: 空状态 (Empty State)
*   **样式**: `border-2 border-dashed border-slate-200 rounded-lg mt-1`.
*   **文本**: "No linked reservation." (`text-sm text-slate-400 italic py-2 text-center`).

---

## 2. Linked Tasks (关联任务)

该模块以列表形式展示所有由该 Intent 衍生或关联的任务。

### 2.1 容器结构
*   **组件类型**: `CollapsibleSection`
*   **标题**: "Linked Tasks"
*   **头部图标**: `Icons.ClipboardCheck` (`w-3.5 h-3.5 text-slate-400`)
*   **头部动作 (Action)**:
    *   按钮: "+ Create Task"
    *   样式: `text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded`.
    *   图标: `Icons.Plus` (`w-3 h-3`).

### 2.2 任务列表项 (Task Item)
列表垂直排列，每个任务是一个可点击的卡片。

*   **排序**: 按 `assignedAt` 倒序排列（最新的在上面）。
*   **外框**:
    *   背景: `bg-white`
    *   边框: `border border-slate-200`
    *   圆角: `rounded-lg`
    *   内边距: `p-3`
    *   间距: `mb-2` (通过 `space-y-2` 控制列表间距).
    *   交互: `hover:border-indigo-300 hover:shadow-sm`.

#### 布局结构
Flex Row (`justify-between items-center`)。

#### 左侧：任务详情
Flex 布局 (`items-center gap-3`)。
1.  **图标容器**:
    *   样式: `p-2 bg-slate-100 rounded-lg text-slate-500`.
    *   图标: `Icons.ClipboardCheck`.
    *   悬停效果: `group-hover:bg-indigo-50 group-hover:text-indigo-600`.
2.  **文本区域**:
    *   **标题**: `text-sm font-medium text-slate-800` (悬停变紫).
    *   **元数据行**: `text-xs text-slate-500 mt-0.5 flex gap-2`.
        *   字段 1: **Assignee Name** (负责人姓名).
        *   分隔符: `•`.
        *   字段 2: **Assigned At** (分配时间，格式如 "11/22/2025, 10:22 AM").

#### 右侧：状态与导航
Flex 布局 (`items-center gap-3`)。
1.  **状态标签 (Badge)**:
    *   样式: `px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize`.
    *   配色: 固定使用 `bg-slate-50 text-slate-600 border-slate-200` (源码实现逻辑).
    *   内容: 任务状态 (如 "in-progress", "completed").
2.  **箭头图标**:
    *   图标: `Icons.ChevronRight`.
    *   颜色: `text-slate-400`.
    *   悬停效果: `group-hover:text-indigo-500`.

### 2.3 空状态 (Empty State)
*   **样式**: 与 Reservation 空状态一致。
*   **文本**: "No linked tasks yet."

---

## 3. 视觉资产对照表 (Icons Mapping)

请确保使用以下对应的 SVG 图标（基于 Heroicons 风格）：

| 模块位置 | 用途 | 图标名称 | 描述 |
| :--- | :--- | :--- | :--- |
| **Header** | 模块图标 | `Icons.Calendar` | 预订模块标题左侧的小图标 |
| **Header** | 模块图标 | `Icons.ClipboardCheck` | 任务模块标题左侧的小图标 |
| **Header** | 创建按钮 | `Icons.Plus` | 小加号图标 |
| **Card (Res)** | 头像占位 | `Icons.User` | 预订卡片左侧的客人图标 |
| **Card (Task)** | 任务占位 | `Icons.ClipboardCheck` | 任务卡片左侧的剪贴板图标 |
| **Card (Both)** | 跳转箭头 | `Icons.ChevronRight` | 卡片最右侧的指示箭头 |

## 4. 关键颜色代码 (Tailwind)

*   **Primary Text**: `text-slate-800` (标题), `text-slate-700` (正文).
*   **Secondary Text**: `text-slate-500`, `text-slate-400` (元数据、图标).
*   **Interactive**: `text-indigo-600`, `bg-indigo-50`, `border-indigo-300` (悬停/激活态).
*   **Border**: `border-slate-200` (默认边框).
*   **Layout Background**: `bg-white`.
