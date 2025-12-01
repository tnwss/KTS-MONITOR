import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Home, Settings, ClipboardList, AlertCircle, HelpCircle, 
  Power, ChevronRight, Activity, Map, ArrowLeft,
  LayoutGrid, Wrench, Save, Download, Phone, Mail, MapPin, Search, X,
  User, Database, PenTool, Layout, Globe, LogOut,
  ZoomIn, ZoomOut, Maximize, CheckSquare
} from 'lucide-react';
import { Gauge } from './components/Gauge';
import { AlarmModal } from './components/AlarmModal';
import { ViewState, Alarm, EquipmentData, SystemParameters, MaintenanceEntry } from './types';

// --- Constants & Assets ---
const DATE_OPTIONS: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

const TRANSLATIONS = {
  en: {
    systemTitle: 'Smart Monitoring System',
    monitorCenter: 'Smart Monitoring',
    equipmentMgmt: 'Equipment\nMgmt',
    onlineMonitor: 'Online\nMonitor',
    remoteControl: 'Remote\nControl',
    operatorAdmin: 'Operator Admin',
    signOut: 'Sign Out',
    reportCenter: 'Report Center',
    newAlerts: 'New',
    bannerDesc: 'Please check the device alarm records, maintenance cycle reports, and operation reports.',
    readReports: 'Read Reports',
    statAlarm: 'Alarm',
    statMaint: 'Equipment Maintenance',
    statTodo: 'To-Do Item',
    statService: 'To Be Serviced',
    statAnomaly: 'Equipment Anomaly',
    searchPlaceholder: 'Search for equipment, alarms or logs...',
    recentAlerts: 'Recent Alerts',
    viewHistory: 'View All History',
    // Dashboard
    oilTemp: 'Oil Temperature',
    windSpeed: 'Wind Speed',
    model: 'Model',
    liftingWeight: 'Lifting Weight',
    speed: 'Speed',
    mainAngle: 'Main Angle',
    ropeLength: 'Rope Length',
    workRadius: 'Work Radius',
    alarmActive: 'ALARM ACTIVE',
    // Remote
    clear: 'CLEAR',
    estop: 'E-STOP!',
    weight: 'WEIGHT',
    length: 'LENGTH',
    luffingDw: 'Luffing DW',
    luffingUp: 'Luffing UP',
    slewingCcw: 'Slewing\nCCW',
    slewingCw: 'Slewing\nCW',
    hoistingDw: 'Hoisting DW',
    hoistingUp: 'Hoisting UP',
    knuckleIn: 'Knuckle\nIN',
    knuckleOut: 'Knuckle\nOUT',
    top: 'TOP',
    side: 'SIDE',
    exit: 'Exit',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    zoomReset: 'Reset',
    // Params
    paramSelector: 'Parameter Setting Selector',
    back: 'Back',
    save: 'Save',
    liftingWeightSetting: 'Lifting Weight Setting',
    liftingWeightLimit: 'Lifting Weight Limit',
    warning90: 'Warning 90%',
    alarm110: 'Alarm 110%',
    workAngle: 'Work Angle',
    hoist: 'Hoist',
    slew: 'Slew',
    knuckle: 'Knuckle',
    luffing: 'Luffing',
    // Records
    maintenanceRecord: 'Maintenance Record',
    repairRecord: 'Repair Record',
    recordEntry: 'Record Entry',
    parts: 'Parts',
    itemProject: 'Item/Project',
    partName: 'Part Name',
    jobContent: 'Job Content',
    exportOrder: 'Export Maintenance Order',
    descriptionPlaceholder: 'Describe the work performed...',
    // Alarm History & Modal
    alarmWindow: 'Alarm window',
    noAlarms: 'No Historical Alarms',
    time: 'Time',
    date: 'Date',
    text: 'Text',
    ackGroup: 'Acknowledge group',
    alarmCode: 'Alarm Cod',
    warningCode: 'Warning Cod',
    alarmInfo: 'Alarm Information',
    warningInfo: 'Warning Information',
    acknowledge: 'ACKNOWLEDGE',
    // Help
    contactDetails: 'Contact Details',
    onSiteService: 'On-site Service',
    address: '10 Bukit Batok Crescent #05-05\nSingapore 658079',
    // Sidebar
    parameterSetting: 'Parameter Setting',
    help: 'Help',
    equipmentList: 'Equipment List',
    crane5T: '5T Knuckle Jib Crane',
    crane15T: '15T Telescopic Boom Crane',
	MAIN_VIEW: "SIDE VIEW",
        TOP_VIEW: "TOP VIEW",
        ALERT: "ALERT",
        MAIN_ANGLE: "MAIN ∠",
        KNUCKLE_ANGLE: "KNUCKLE ∠",
        RADIUS: "RADIUS",
        SPEED: "SPEED",
        SLEW_ANGLE: "SLEW ∠",
        METERS: "m",
        DEGREES: "°",
        TONS: "T",
        MPS: "m/s",
	
    // Specific Alarm Messages
    alarms: {
        'MSTP 001': 'Emergency Stop Button of Main Pump Motor Control Cabinet Pressed, Reset After Fault Resolution.',
        'MSOL 002': 'Main Pump Motor Overload - Check if the Load Exceeds the Limit and Whether the Motor is Damaged.',
        'CESTP 003': 'Press the Emergency Stop Button on the Crane Control Cabinet',
        'OVLD 004': 'Lifting Weight to 110% Lifting Overload.',
        'ATB-3001': 'ATB (Anti-Over hoisting Switch) High Limit Triggered - Lower the Load to the Position Below ATB.',
        'MSOL-3002': 'Oil Temperature Too High.',
        'HPUL-3003': 'HPU LOW OIL LEVEL.',
        'HPULI-3004': 'HPU LOW OIL TEMPERATURE.',
        'HPUF-3005': 'HPU RETURN FILTER CLOGGED.',
        'MHLL-3006': 'MAIN HOIST LOW LIMIT.'
    }
  },
  zh: {
    systemTitle: '智能远程监控系统',
    monitorCenter: '智能监控中心',
    equipmentMgmt: '设备\n管理',
    onlineMonitor: '在线\n监控',
    remoteControl: '远程\n控制',
    operatorAdmin: '操作管理员',
    signOut: '登出',
    reportCenter: '报告中心',
    newAlerts: '新消息',
    bannerDesc: '请检查设备报警记录、维护周期报告和运维报告。',
    readReports: '阅读报告',
    statAlarm: '报警',
    statMaint: '设备保养',
    statTodo: '待办事项',
    statService: '待保养',
    statAnomaly: '设备异常',
    searchPlaceholder: '搜索设备、报警或日志...',
    recentAlerts: '最近报警',
    viewHistory: '查看所有历史',
    // Dashboard
    oilTemp: '油温',
    windSpeed: '风速',
    model: '型号',
    liftingWeight: '起重量',
    speed: '速度',
    mainAngle: '主臂角度',
    ropeLength: '绳长',
    workRadius: '工作半径',
    alarmActive: '报警激活',
    // Remote
    clear: '清除',
    estop: '急停!',
    weight: '重量',
    length: '长度',
    luffingDw: '变幅 下',
    luffingUp: '变幅 上',
    slewingCcw: '回转\n逆时针',
    slewingCw: '回转\n顺时针',
    hoistingDw: '起升 下',
    hoistingUp: '起升 上',
    knuckleIn: '折臂\n收',
    knuckleOut: '折臂\n伸',
    top: '顶部',
    side: '侧面',
    exit: '退出',
    zoomIn: '放大',
    zoomOut: '缩小',
    zoomReset: '重置',
    // Params
    paramSelector: '参数设置选择',
    back: '返回',
    save: '保存',
    liftingWeightSetting: '起重量设置',
    liftingWeightLimit: '起重量限制',
    warning90: '预警 90%',
    alarm110: '报警 110%',
    workAngle: '工作角度',
    hoist: '起升',
    slew: '回转',
    knuckle: '折臂',
    luffing: '变幅',
    // Records
    maintenanceRecord: '保养记录',
    repairRecord: '维修记录',
    recordEntry: '记录录入',
    parts: '部位',
    itemProject: '项目',
    partName: '部件名称',
    jobContent: '作业内容',
    exportOrder: '导出保养单',
    descriptionPlaceholder: '描述执行的作业内容...',
    // Alarm History & Modal
    alarmWindow: '报警窗口',
    noAlarms: '无历史报警',
    time: '时间',
    date: '日期',
    text: '内容',
    ackGroup: '确认组',
    alarmCode: '报警代码',
    warningCode: '预警代码',
    alarmInfo: '报警信息',
    warningInfo: '预警信息',
    acknowledge: '确认收到',
    // Help
    contactDetails: '联系方式',
    onSiteService: '现场服务',
    address: '新加坡 武吉巴督新月10号 #05-05\n邮编 658079',
    // Sidebar
    parameterSetting: '参数设置',
    help: '帮助',
    equipmentList: '设备列表',
    crane5T: '5T 折臂吊',
    crane15T: '15T 伸缩臂吊',
	MAIN_ANGLE: "主臂 ∠",
    KNUCKLE_ANGLE: "折臂 ∠",
    RADIUS: "半径",
    SPEED: "速度",
	SLEW_ANGLE: "回转 ∠",
    METERS: "m",
    DEGREES: "°",
    TONS: "T",
    MPS: "m/s",
	MAIN_VIEW: "侧视图",
    TOP_VIEW: "俯视图",
    // Specific Alarm Messages
    alarms: {
        'MSTP 001': '主泵电机控制柜急停按钮被按下，故障排除后复位。',
        'MSOL 002': '主泵电机过载 - 检查负载是否超限以及电机是否损坏。',
        'CESTP 003': '按下起重机控制柜上的急停按钮。',
        'OVLD 004': '起重量达到110%，起重过载。',
        'ATB-3001': '防过卷开关(ATB)上限触发 - 将负载降低至ATB以下位置。',
        'MSOL-3002': '油温过高。',
        'HPUL-3003': '液压泵站(HPU)油位低。',
        'HPULI-3004': '液压泵站(HPU)油温低。',
        'HPUF-3005': '液压泵站(HPU)回油滤芯堵塞。',
        'MHLL-3006': '主起升下限位。'
    }
  }
};

const INITIAL_ALARMS: Alarm[] = [
  { code: 'MSTP 001', message: 'Emergency Stop Button of Main Pump Motor Control Cabinet Pressed, Reset After Fault Resolution.', type: 'ALARM', timestamp: '2025-11-12 08:00:00', active: true },
  { code: 'ATB-3001', message: 'ATB (Anti-Over hoisting Switch) High Limit Triggered - Lower the Load to the Position Below ATB.', type: 'WARNING', timestamp: '2025-11-12 09:30:00', active: true },
];

const INITIAL_RECORDS: MaintenanceEntry[] = [
    { id: '1', type: 'Maintenance', component: 'Crane Boom', date: '01/11/2025', time: '10:00', partName: 'Wire Rope', description: 'Regular greasing applied.', employee: 'John Doe' },
    { id: '2', type: 'Repair', component: 'Hydraulic Pump', date: '28/10/2025', time: '14:30', partName: 'Seal Kit', description: 'Replaced leaking seal on main pump.', employee: 'Jane Smith' }
];

// --- Visual Components ---

function KTSLogo({ color = "text-[#003366]" }: { color?: string }) {
  return (
  <div className="flex flex-col select-none cursor-pointer hover:opacity-90 transition-opacity">
    <div className="flex items-center h-7 gap-1">
       <div className="h-5 w-2 bg-[#e65100] transform -skew-x-[17deg] shadow-sm border relative z-10 border-[#bf360c] translate-y-0.5"></div>
       <div className="h-full bg-[#003366] transform -skew-x-[20deg] pl-0 pr-1 flex items-center justify-start shadow-sm min-w-[60px] border border-[#001f3f]">
          <span className="text-white font-black italic text-2xl transform skew-x-[17deg] leading-tight pt-0.5 drop-shadow-md relative -left-3.5" style={{ fontFamily: 'Arial, sans-serif' }}>KTS</span>
       </div>
    </div>
    <div className={`${color} font-bold italic text-[10px] tracking-[0.4em] pl-5 leading-none mt-0.5 scale-x-110 origin-left`} style={{ fontFamily: 'Arial, sans-serif' }}>
      ENERGY
    </div>
  </div>
  );
}

const IMAGE_PATHS = {
        MAIN_BOOM: '/assets/main_boom_side.png',
        KNUCKLE_BOOM: '/assets/knuckle_boom_side.png',
        PEDESTAL_BASE: '/assets/pedestal_base_side.png',
        TOP_VIEW_CRANE: '/assets/crane_top_view.png',
    };

function CraneVisual({ 
    angle, 
    ropeLength, 
    activeAlarm, 
    knuckleAngle = 0, 
    slewAngle = 0, 
    viewMode = 'SIDE',
    weight = 0, 
    speed = 0,
    zoom = 1,
    // 💡 1. 接收来自 RemoteControlView 的映射后角度
    displayKnuckleAngle 
}: { 
    angle: number, 
    ropeLength: number, 
    activeAlarm: boolean, 
    knuckleAngle?: number, 
    slewAngle?: number,
    viewMode?: 'SIDE' | 'TOP',
    weight?: number,
    speed?: number,
    zoom?: number,
    // 💡 2. 添加 displayKnuckleAngle 的类型定义
    displayKnuckleAngle?: number 
}) {
    // --- 调试开关：设置为 true 会显示红点、绿点、蓝点，用于校准 ---
    const DEBUG_MODE = false; 

    // Calculate ViewBox based on zoom
    const vbW = 300 / zoom;
    const vbH = 200 / zoom;
    const vbX = (300 - vbW) / 2;
    const vbY = (200 - vbH) / 2;
    const viewBox = `${vbX} ${vbY} ${vbW} ${vbH}`;

    // 💡 3. 定义最终用于显示的角度值
    const angleToDisplay = displayKnuckleAngle !== undefined 
        ? displayKnuckleAngle 
        : knuckleAngle;

    // ==================================================================================
    // --- TOP VIEW 逻辑 (已添加旋转) ---
    // ==================================================================================
    if (viewMode === 'TOP') {
        // 假设 TOP 视图的旋转中心位于 SVG 视图的中央 (150, 100)
        const topPivotX = 150;
        const topPivotY = 100;
        // 假设 TOP 视图图片尺寸为 300x200 (与 SVG 视图一致，便于居中)
        const topImgWidth = 300; 
        const topImgHeight = 200; 
        // ====== 新增魔法参数：图片偏移量 ======
        const imageOffsetX = 120; // 正值：图片向右移动。负值：图片向左移动。
        const imageOffsetY = -5;  // 正值：图片向下移动。负值：图片向上移动。
        return (
             <div className="w-full h-full bg-slate-900 relative overflow-hidden border border-slate-600 rounded">
                 <div className="absolute top-2 right-2 text-white text-xs font-bold drop-shadow opacity-50">TOP VIEW</div>
                 <svg width="100%" height="100%" viewBox={viewBox} className="transition-all duration-300 ease-out">
                     <rect x="-1000" y="-1000" width="4000" height="4000" fill="#0f172a" />
                     
                     {/* Top View Crane Image with Slew Rotation */}
                     <g transform={`translate(${topPivotX}, ${topPivotY}) rotate(${slewAngle})`}>
                         <image 
                             href={IMAGE_PATHS.TOP_VIEW_CRANE} // 假设 IMAGE_PATHS 已定义
                             x={-topImgWidth / 2 + imageOffsetX} 
                             y={-topImgHeight / 2 + imageOffsetY}
                             width={topImgWidth} 
                             height={topImgHeight} 
                         />
                     </g>
                     
                     {/* 调试模式下的旋转中心点 */}
                     {DEBUG_MODE && (
                         <circle cx={topPivotX} cy={topPivotY} r={3} fill="yellow" stroke="white" strokeWidth={0.5}/>
                     )}
                 </svg>
             </div>
        );
    }

    // ==================================================================================
    // --- 侧视图：魔法参数区 (您的校准参数保持不变) ---
    // ==================================================================================

    // 【魔法参数 A】：控制红点 (Main Pivot) 的世界坐标。
    const pivotWorldX = 60;    
    const pivotWorldY = 103;   

    // 【魔法参数 B】：绿点的高度补偿 (修正主臂图片固有倾斜)。
    const mainBoomMathOffsetAngle = 1; 

    // 【魔法参数 C】：主臂的"视觉长度" (红点到绿点的距离)。
    const visualMainBoomLength = 182; 
    
    // **********************************************
    // --- 新增蓝点校准参数 (您的校准值保持不变) ---
    // **********************************************
    
    // 【魔法参数 D】：折臂的"视觉长度" (绿点到蓝点的距离)。
    const visualKnuckleBoomLength = -130; 

    // 【魔法参数 E】：蓝点的高度补偿 (修正折臂图片固有倾斜)。
    const knuckleBoomMathOffsetAngle = 55; 

    // --- 原始图片定位参数 (保持不变，用于绘制图片) ---
    const mbImgOffsetX = 60; const mbImgOffsetY = 217; 
    const kbImgOffsetX = 233; const kbImgOffsetY = 150; 
    const initialBoomOffsetAngle = 20; 
    const initialKnuckleOffsetAngle = 92;

    // --- 运动学计算 (Kinematics) ---

    // 1. 主臂角度计算
    const radMain = ((angle + mainBoomMathOffsetAngle) * Math.PI) / 180;
    
    // 2. 计算点2 (Joint - 绿点) 的位置
    const jointX = pivotWorldX + visualMainBoomLength * Math.cos(radMain);
    const jointY = pivotWorldY - visualMainBoomLength * Math.sin(radMain);

    // 3. 折臂角度和尖端 (Tip - 蓝点) 计算
    // 注意：这里仍然使用原始的 knuckleAngle (动画值)
    const radKnuckle = ((angle - knuckleAngle + mainBoomMathOffsetAngle + knuckleBoomMathOffsetAngle) * Math.PI) / 180;
    
    // 使用新的可调长度 D
    const tipX = jointX + visualKnuckleBoomLength * Math.cos(radKnuckle);
    const tipY = jointY - visualKnuckleBoomLength * Math.sin(radKnuckle);

    // 统一液压缸使用的折臂长度
    const knuckleBoomLen = visualKnuckleBoomLength; 

    // --- 液压缸和辅助组件 (保持不变) ---
    const pivotX = 60; const pivotY = 90; 
    const groundY = 170; 
    const rot = (len: number, r: number) => ({ x: len * Math.cos(r), y: -len * Math.sin(r) });
    const getPointOnBoom = (originX: number, originY: number, rad: number, dist: number, offset: number) => {
             const cos = Math.cos(rad); const sin = Math.sin(rad);
             return { x: originX + dist * cos + offset * Math.sin(rad), y: originY - dist * sin + offset * Math.cos(rad) };
    }
    const mcBase = { x: pivotX + 10, y: pivotY + 43 }; 
    const mcAttach = getPointOnBoom(pivotWorldX, pivotWorldY, radMain, 64, 10);
    const kcBase = getPointOnBoom(pivotWorldX, pivotWorldY, radMain, 106, 10);
    // kcAttach 使用 radKnuckle
    const kcAttach = getPointOnBoom(jointX, jointY, radKnuckle, -22, 6); 
    const ropeDrop = 10 + (ropeLength * 8); // 保持您的修改

    const Cylinder = ({ start, end, thickness = 8, isBlack = true, fixedLen }: any) => {
         const dx = end.x - start.x; const dy = end.y - start.y;
         const len = Math.sqrt(dx*dx + dy*dy);
         const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;
         const barrelL = fixedLen || (len * 0.6);
         return (
             <g transform={`translate(${start.x}, ${start.y}) rotate(${angleDeg})`}>
                 <rect x={barrelL - 4} y={-thickness/2 + 2} width={Math.max(0, len - barrelL + 4)} height={thickness - 4} fill="#e2e8f0" stroke="#94a3b8" />
                 <rect x={0} y={-thickness/2} width={barrelL} height={thickness} rx={1} fill={isBlack ? "#1a1a1a" : "#cbd5e1"} stroke={isBlack ? "black" : "#64748b"} />
                 <circle cx={0} cy={0} r={thickness/2} fill="#334155" />
                 <circle cx={len} cy={0} r={thickness/2} fill="#334155" />
             </g>
         )
    }
    
    // 图片尺寸配置 (保持你原来的)
    const mbImgWidth = 400; const mbImgHeight = 400;
    const kbImgWidth = 400; const kbImgHeight = 400;
    const pBaseWidth = 400; const pBaseHeight = 400;
    const pBaseOffsetX = 70; const pBaseOffsetY = 203;


    return (
        <div className="w-full h-full bg-gradient-to-b from-[#e0f2fe] to-white relative overflow-hidden border border-slate-300 rounded shadow-inner">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

             <svg width="100%" height="100%" viewBox={viewBox} className="transition-all duration-300 ease-out">
                 {/* ... Defs ... */}
                 <defs>
                    <filter id="dropshadow" height="130%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/> 
                      <feOffset dx="1" dy="2" result="offsetblur"/>
                      <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
                      <feMerge><feMergeNode in="offsetblur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                 </defs>

                 {/* Ground */}
                 <rect x="-1000" y={groundY} width="4000" height="1000" fill="#cbd5e1" />
                 <line x1="-1000" y1={groundY} x2="3000" y2={groundY} stroke="#94a3b8" strokeWidth="2"/>
                 
                 {/* 液压缸 */}
                 <Cylinder start={mcBase} end={mcAttach} thickness={7} isBlack={true} fixedLen={55} />
                 <Cylinder start={kcBase} end={kcAttach} thickness={6} isBlack={true} fixedLen={55} />
                 
                 {/* 基座图片 */}
                 <g transform={`translate(${pivotX}, ${pivotY})`}>
                     <image href={IMAGE_PATHS.PEDESTAL_BASE} x={-pBaseOffsetX} y={-pBaseOffsetY} width={pBaseWidth} height={pBaseHeight} /> {/* 假设 IMAGE_PATHS 已定义 */}
                 </g>

                 {/* ================= DEBUG 骨骼层 (点和线) ================= */}
                 {DEBUG_MODE && (
                     <g>
                         {/* 红点 (主臂旋转中心) */}
                         <circle cx={pivotWorldX} cy={pivotWorldY} r={3} fill="red" stroke="white" strokeWidth={0.5}/>
                         {/* 绿点 (主臂尖端/折臂根部) */}
                         <circle cx={jointX} cy={jointY} r={3} fill="#00ff00" stroke="white" strokeWidth={0.5}/>
                         {/* 蓝点 (折臂尖端) */}
                         <circle cx={tipX} cy={tipY} r={3} fill="blue" stroke="white" strokeWidth={0.5}/>
                         {/* 骨骼连线 (红点 -> 绿点) */}
                         <line x1={pivotWorldX} y1={pivotWorldY} x2={jointX} y2={jointY} stroke="red" strokeWidth="1" strokeDasharray="2 2" />
                         {/* 骨骼连线 (绿点 -> 蓝点) */}
                         <line x1={jointX} y1={jointY} x2={tipX} y2={tipY} stroke="blue" strokeWidth="1" strokeDasharray="2 2" />
                     </g>
                 )}
                 
                 {/* ================= KNUCKLE BOOM (折臂图片) ================= */}
                 {/* 注意：这里的旋转角度仍然使用原始的 knuckleAngle 进行计算 */}
                 <g transform={`translate(${jointX}, ${jointY}) rotate(${-(angle - knuckleAngle) + initialKnuckleOffsetAngle})`} filter="url(#dropshadow)">
                     <image 
                         href={IMAGE_PATHS.KNUCKLE_BOOM}
                         x={-kbImgOffsetX} 
                         y={-kbImgOffsetY} 
                         width={kbImgWidth} 
                         height={kbImgHeight} 
                     />
                 </g>
                 
                 {/* ================= MAIN BOOM (主臂图片) ================= */}
                 <g transform={`translate(${pivotWorldX}, ${pivotWorldY}) rotate(${-angle + initialBoomOffsetAngle})`} filter="url(#dropshadow)">
                     <image 
                         href={IMAGE_PATHS.MAIN_BOOM}
                         x={-mbImgOffsetX} 
                         y={-mbImgOffsetY} 
                         width={mbImgWidth} 
                         height={mbImgHeight} 
                     />
                 </g>

                 {/* 钢丝绳、吊钩和负载 */}
                 <line x1={tipX} y1={tipY} x2={tipX} y2={tipY + ropeDrop} stroke="#1f2937" strokeWidth="1" />
                 <g transform={`translate(${tipX}, ${tipY + ropeDrop})`}>
                     <rect x="-6" y="-10" width="12" height="14" rx="2" fill="#facc15" stroke="#ca8a04" />
                     <path d="M0,4 L0,10 C0,14 5,14 5,10" fill="none" stroke="#ca8a04" strokeWidth="2.5" />
                     <rect x="-10" y="14" width="20" height="20" fill={activeAlarm ? "#ef4444" : "#cbd5e1"} stroke="#64748b" strokeWidth="1" />
                     <text x="0" y="26" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#1e293b">{weight?.toFixed(1)}T</text>
                 </g>
                 
                 {/* 状态信息框 */}
                 <g transform="translate(10, 10)">
                     <rect width="90" height="50" rx="4" fill="rgba(255,255,255,0.9)" stroke="#e2e8f0" />
                     <text x="8" y="15" fontSize="8" fontWeight="bold" fill="#334155">MAIN ∠: {angle.toFixed(1)}°</text>
                     {/* 💡 4. 使用映射后的角度进行显示 */}
                     <text x="8" y="27" fontSize="8" fontWeight="bold" fill="#334155">KNUCKLE: {angleToDisplay.toFixed(1)}°</text>
                     <text x="8" y="39" fontSize="8" fontWeight="bold" fill="#334155">RADIUS: {ropeLength.toFixed(1)}m</text>
                 </g>

                 {activeAlarm && (
                     <g transform="translate(240, 10)">
                         <rect width="50" height="20" rx="4" fill="#ef4444" />
                         <text x="25" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">ALERT</text>
                     </g>
                 )}
             </svg>
        </div>
    );
}

function MapVisual() {
    return (
    <div className="w-full h-full bg-[#0f172a] relative overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
            <path d="M0,0 L400,0 L400,200 L0,200 Z" fill="#001e3c" />
            <path d="M0,50 Q50,40 100,80 T200,60 T300,100 T400,80 L400,200 L0,200 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
            <line x1="100" y1="0" x2="100" y2="200" stroke="#1e293b" strokeDasharray="5 5" opacity="0.3" />
            <line x1="200" y1="0" x2="200" y2="200" stroke="#1e293b" strokeDasharray="5 5" opacity="0.3" />
            <line x1="300" y1="0" x2="300" y2="200" stroke="#1e293b" strokeDasharray="5 5" opacity="0.3" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="#1e293b" strokeDasharray="5 5" opacity="0.3" />
            <path d="M50,150 Q150,120 250,140" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <g transform="translate(250, 140)">
                <circle r="6" fill="#fbbf24" stroke="#fff" strokeWidth="2" />
                <circle r="12" fill="#ef4444" opacity="0.5">
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="r" values="6;18;6" dur="1s" repeatCount="indefinite" />
                </circle>
                <text x="15" y="5" fill="#fbbf24" fontSize="10" fontWeight="bold" fontFamily="monospace">VESSEL-01</text>
            </g>
        </svg>
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 text-[10px] text-green-400 border border-green-900 font-mono">
            LAT: 1.2834 N <br/> LON: 103.8607 E
        </div>
    </div>
    );
}

function Header({ onNavigateHome, currentTime, language, setLanguage }: any) {
    const [showLangMenu, setShowLangMenu] = useState(false);
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

    return (
    <header className="bg-[#001F3F] text-white h-16 flex items-center justify-between px-4 border-b-4 border-[#00A8E8] shadow-xl shrink-0 z-50">
      <div className="flex items-center gap-4">
        <button onClick={onNavigateHome} className="hover:bg-white/10 p-2 rounded transition-colors">
            <Home size={26} className="text-[#00A8E8]" />
        </button>
        <KTSLogo color="text-white" />
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 bg-[#001F3F] px-8 py-1 rounded-b-xl border-b border-l border-r border-gray-700 shadow-lg">
         <span className="text-lg font-bold text-gray-200 tracking-wider">
             {t.systemTitle}
         </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm font-mono text-[#00A8E8] bg-black/30 px-3 py-1 rounded border border-gray-700 shadow-inner min-w-[160px] text-center">
            {currentTime}
        </div>
        <div className="relative">
            <button 
                className="flex items-center gap-2 hover:bg-white/10 px-2 py-1 rounded transition-colors"
                onClick={() => setShowLangMenu(!showLangMenu)}
            >
                <Globe size={16} className="text-gray-400"/>
                <div className="w-8 h-5 relative overflow-hidden border border-white shadow-sm">
                    {language === 'zh' ? (
                        <img src="https://flagcdn.com/w40/cn.png" className="w-full h-full object-cover" alt="CN"/>
                    ) : (
                        <img src="https://flagcdn.com/w40/gb.png" className="w-full h-full object-cover" alt="EN"/>
                    )}
                </div>
            </button>
            
            {showLangMenu && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <button onClick={() => { setLanguage('zh'); setShowLangMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-slate-800">
                        <img src="https://flagcdn.com/w20/cn.png" alt="CN"/> 中文
                    </button>
                    <button onClick={() => { setLanguage('en'); setShowLangMenu(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 text-slate-800">
                        <img src="https://flagcdn.com/w20/gb.png" alt="EN"/> English
                    </button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
}

function SideButton({ label, icon: Icon, onClick, active, colorClass = "from-[#002B55] to-slate-800" }: any) {
    return (
    <button 
      onClick={onClick}
      className={`
        w-full h-14 mb-3 rounded-lg flex items-center px-3 gap-3 transition-all duration-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] border border-slate-600
        bg-gradient-to-r hover:brightness-110 active:scale-95 group
        ${active 
          ? 'from-[#00A8E8] to-cyan-600 border-white text-white scale-105 shadow-[0_0_15px_rgba(0,168,232,0.4)]' 
          : `${colorClass} text-gray-300 hover:border-[#00A8E8] hover:text-white`
        }
      `}
    >
      <div className={`p-1.5 rounded-full ${active ? 'bg-white/20' : 'bg-black/30'} group-hover:bg-[#00A8E8]/20 transition-colors`}>
        <Icon size={18} />
      </div>
      <span className="font-bold text-xs uppercase tracking-tight text-left leading-none flex-1 whitespace-pre-line">
        {label}
      </span>
      {active && <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_5px_white]"></div>}
    </button>
    );
}

function LandingView({ setCurrentView, alarmHistory, language, setLanguage }: any) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

    return (
    <div className="flex h-screen bg-gray-100 font-sans text-slate-800 overflow-hidden">
       <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-8 shadow-sm z-10 relative">
           <div className="scale-75 origin-center"><KTSLogo /></div>
           
           <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#00509E] transition-colors group">
             <div className="p-2 rounded-xl group-hover:bg-blue-50"><Settings size={24} /></div>
             <span className="text-[9px] font-bold text-center leading-3 whitespace-pre-line">{t.equipmentMgmt}</span>
           </button>
           
           <button 
             className="flex flex-col items-center gap-1 text-[#00509E] transition-colors group relative"
             onClick={() => setCurrentView(ViewState.DASHBOARD)}
            >
             <div className="p-2 rounded-xl bg-blue-50"><LayoutGrid size={24} /></div>
             <span className="text-[9px] font-bold text-center leading-3 whitespace-pre-line">{t.onlineMonitor}</span>
             <div className="absolute right-0 top-2 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
           </button>
           
           <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#00509E] transition-colors group" onClick={() => setCurrentView(ViewState.REMOTE_CONTROL)}>
             <div className="p-2 rounded-xl group-hover:bg-blue-50"><Power size={24} /></div>
             <span className="text-[9px] font-bold text-center leading-3 whitespace-pre-line">{t.remoteControl}</span>
           </button>

           <div className="mt-auto flex flex-col items-center gap-4 w-full relative">
             <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300" onClick={() => setShowUserMenu(!showUserMenu)}>
                 <User size={16}/>
             </div>
             {showUserMenu && (
                 <div className="absolute left-16 bottom-0 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 z-50">
                     <div className="px-3 py-2 border-b border-gray-100 mb-1">
                         <div className="font-bold text-sm">{t.operatorAdmin}</div>
                         <div className="text-xs text-gray-400">ID: 8839201</div>
                     </div>
                     <button className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded flex items-center gap-2">
                         <LogOut size={14}/> {t.signOut}
                     </button>
                 </div>
             )}
             <div className="h-px w-8 bg-gray-300"></div>
             <Home size={24} className="text-gray-800"/>
           </div>
       </div>

       <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6">
          <div className="max-w-5xl mx-auto space-y-8">
              
              <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <span className="bg-[#00509E] w-2 h-8 rounded-full"></span>
                      {t.monitorCenter}
                  </h1>
                  <div className="flex gap-2 relative">
                      <button onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')} className="hover:opacity-80 transition-opacity">
                        <img src={language === 'zh' ? "https://flagcdn.com/w40/cn.png" : "https://flagcdn.com/w40/gb.png"} className="h-6 rounded shadow" alt="Lang"/>
                      </button>
                  </div>
              </div>

              <div 
                className="relative h-64 rounded-3xl overflow-hidden shadow-2xl cursor-pointer group bg-gradient-to-r from-sky-400 via-[#00A8E8] to-[#00509E]"
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
              >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                  <div className="absolute inset-0 p-10 flex flex-col justify-center text-white">
                      <div className="bg-white/20 backdrop-blur w-fit px-4 py-1 rounded-full text-xs font-bold uppercase mb-4 border border-white/30">VALLIANZ HOPE</div>
                      <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
                          {t.reportCenter} <div className="bg-red-500 text-xs px-2 py-1 rounded-full animate-pulse">8 {t.newAlerts}</div>
                      </h2>
                      <p className="max-w-lg text-lg opacity-90 mb-8 font-light">
                          {t.bannerDesc}
                      </p>
                      <button className="bg-[#F59E0B] text-black px-8 py-3 rounded-xl font-bold w-max hover:bg-[#D97706] transition-colors shadow-lg flex items-center gap-2">
                          {t.readReports} <ChevronRight size={18}/>
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {[
                      { val: 5, label: t.statAlarm, color: "bg-orange-500", text: "text-white", view: ViewState.ALARM_HISTORY },
                      { val: 2, label: t.statMaint, color: "bg-yellow-400", text: "text-slate-900", view: ViewState.MAINTENANCE_RECORD },
                      { val: 3, label: t.statTodo, color: "bg-emerald-500", text: "text-white", view: ViewState.TODO_LIST },
                      { val: 1, label: t.statService, color: "bg-yellow-200", text: "text-yellow-800", view: ViewState.MAINTENANCE_RECORD },
                      { val: 0, label: t.statAnomaly, color: "bg-yellow-100", text: "text-yellow-600", view: ViewState.REPAIR_RECORD },
                  ].map((stat, idx) => (
                      <div 
                        key={idx} 
                        className={`${stat.color} ${stat.text} rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg transform hover:-translate-y-1 transition-transform cursor-pointer hover:shadow-xl active:scale-95`}
                        onClick={() => stat.view ? setCurrentView(stat.view) : alert("No items in this category.")}
                      >
                          <span className="text-5xl font-black mb-2">{stat.val}</span>
                          <span className="text-xs font-bold uppercase text-center leading-tight tracking-wide">{stat.label}</span>
                      </div>
                  ))}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="relative mb-6">
                      <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                      <input type="text" placeholder={t.searchPlaceholder} className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#00509E] transition-all" />
                      <button className="absolute right-3 top-2.5 p-1 text-gray-400 hover:text-gray-800"><LayoutGrid size={20}/></button>
                  </div>

                  <div className="space-y-4">
                      <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">{t.recentAlerts}</h3>
                      {alarmHistory.slice(0, 3).map((alarm: Alarm, idx: number) => {
                          // Lookup translated message
                          const msg = t.alarms[alarm.code as keyof typeof t.alarms] || alarm.message;
                          return (
                          <div 
                             key={idx} 
                             onClick={() => setCurrentView(ViewState.ALARM_HISTORY)}
                             className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                                      <AlertCircle size={20} />
                                  </div>
                                  <div>
                                      <div className="font-bold text-slate-700 group-hover:text-red-700">{alarm.code}</div>
                                      <div className="text-xs text-gray-400">{alarm.timestamp}</div>
                                  </div>
                              </div>
                              <div className="text-sm font-medium text-gray-600 max-w-md truncate">{msg}</div>
                              <ChevronRight size={18} className="text-gray-300 group-hover:text-red-400" />
                          </div>
                      )})}
                      
                      <button 
                        className="w-full py-3 text-center text-sm font-bold text-[#00509E] hover:bg-blue-50 rounded-xl transition-colors"
                        onClick={() => setCurrentView(ViewState.ALARM_HISTORY)}
                      >
                          {t.viewHistory}
                      </button>
                  </div>
              </div>

          </div>
       </div>
    </div>
  );
}

function DashboardView({ data, activeAlarm, setActiveAlarm, language }: any) {
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

    // =========================================================================
    // 💡 1. 复制并定义反向线性映射函数：将 [-70, 43] 反向映射到 [150, 30]
    //    确保显示值与 RemoteControlView 同步。
    // =========================================================================
    const mapKnuckleAngle = (knuckleAngle) => {
        const inMin = -70;   // 原始数据的最小值 (对应显示 150°)
        const inMax = 43;    // 原始数据的最大值 (对应显示 30°)
        const outMin = 150;  // 目标显示值 (当原始值为 inMin 时)
        const outMax = 30;   // 目标显示值 (当原始值为 inMax 时)

        const inputRange = inMax - inMin; // 113
        const outputRange = outMax - outMin; // -120
        
        if (inputRange === 0) return outMin;

        // 线性映射公式: OutMin + OutputRange * (InputValue - InMin) / InputRange
        const mappedAngle = outMin + outputRange * (knuckleAngle - inMin) / inputRange;

        // 限制结果在 [30, 150] 范围内
        return Math.min(Math.max(mappedAngle, outMax), outMin); 
    };

    // 💡 2. 计算要显示给 CraneVisual 的折臂角度
    const displayKnuckleAngle = mapKnuckleAngle(data.knuckleAngle);


    return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 h-full bg-[#001F3F] p-2">
      <div className="col-span-full lg:col-span-3 bg-[#002B55]/80 border border-slate-600 rounded-lg p-2 flex flex-col gap-2 shadow-inner">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#0f172a] rounded p-2 border border-slate-700 shadow-lg relative">
             <div className="absolute top-1 left-2 text-[10px] text-gray-400 font-bold uppercase">{t.oilTemp}</div>
             <Gauge value={data.oilTemp} min={0} max={120} label="TEMP" unit="°C" color={data.oilTemp > 90 ? "#ef4444" : "#00A8E8"} /> {/* 假设 Gauge 组件已定义 */}
          </div>
          <div className="bg-[#0f172a] rounded p-2 border border-slate-700 shadow-lg relative">
             <div className="absolute top-1 left-2 text-[10px] text-gray-400 font-bold uppercase">{t.windSpeed}</div>
             <Gauge value={data.windSpeed} min={0} max={40} label="SPEED" unit="m/s" color={data.windSpeed > 20 ? "#eab308" : "#22c55e"} />
          </div>
        </div>

        <div className="flex-1 bg-[#0f172a] rounded border border-slate-700 p-1 overflow-auto">
           <table className="w-full text-xs text-left border-collapse">
             <tbody>
               {[
                 [t.model, data.model === '5T MODEL' ? t.crane5T : t.crane15T],
                 [t.liftingWeight, `${data.liftingWeight.toFixed(2)} T`],
                 [t.speed, `${data.speed.toFixed(1)} M/S`],
                 [t.mainAngle, `${data.mainAngle.toFixed(1)} °`],
                 [t.ropeLength, `${data.ropeLength.toFixed(1)} M`],
                 [t.workRadius, `${data.workRadius.toFixed(1)} M`]
               ].map(([label, val], idx) => (
                 <tr key={idx} className="border-b border-slate-800 hover:bg-white/5 transition-colors">
                   <td className="py-3 px-3 text-gray-400 font-medium">{label}</td>
                   <td className="py-3 px-3 text-right font-bold text-white bg-white/5 rounded-l">{val}</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>

      <div className="col-span-full lg:col-span-9 flex flex-col gap-2 h-full overflow-hidden">
           <div className="flex-[3] min-h-0 bg-black rounded-lg border border-slate-600 relative overflow-hidden group">
             <CraneVisual 
                 angle={data.mainAngle} 
                 ropeLength={data.ropeLength} 
                 activeAlarm={!!activeAlarm}
                 knuckleAngle={data.knuckleAngle} // 动画使用原始值
                 slewAngle={data.slewAngle}
                 viewMode="SIDE"
                 weight={data.liftingWeight}
                 speed={data.speed}
                 // 💡 3. 将映射后的角度传递给 CraneVisual 用于显示
                 displayKnuckleAngle={displayKnuckleAngle} 
             />
           </div>
           
           <div className="flex-[2] min-h-0 bg-black rounded-lg border border-slate-600 relative overflow-hidden">
              <MapVisual /> {/* 假设 MapVisual 组件已定义 */}
           </div>
      </div>
    </div>
    )
}

function RemoteControlView({ data, params, activeAlarm, setActiveControl, clearAlarm, language }: any) {
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
    const alarmMsg = activeAlarm ? (t.alarms[activeAlarm.code as keyof typeof t.alarms] || activeAlarm.message) : "";
    const [viewMode, setViewMode] = useState<'SIDE' | 'TOP'>('SIDE');
    const [zoom, setZoom] = useState(1);

    // =========================================================================
    // 💡 修正后的线性映射函数：将 [-70, 43] 反向映射到 [150, 30]
    // =========================================================================
    const mapKnuckleAngle = (knuckleAngle) => {
        const inMin = -70;   // 原始数据的最小值 (对应折臂伸出)
        const inMax = 43;    // 原始数据的最大值 (对应折臂收回)
        const outMin = 150;  // 目标显示的值：当原始值为 inMin 时显示 150°
        const outMax = 30;   // 目标显示的值：当原始值为 inMax 时显示 30°

        const inputRange = inMax - inMin; // 43 - (-70) = 113
        const outputRange = outMax - outMin; // 30 - 150 = -120
        
        // 确保分母不为零
        if (inputRange === 0) return outMin;

        // 线性映射公式: OutMin + OutputRange * (InputValue - InMin) / InputRange
        const mappedAngle = outMin + outputRange * (knuckleAngle - inMin) / inputRange;

        // 限制结果在 [30, 150] 范围内 (注意这里取 min 和 max 的顺序)
        return Math.min(Math.max(mappedAngle, outMax), outMin); 
        // 解释：Math.max(mappedAngle, 30) 确保不小于30
        //       Math.min(..., 150) 确保不大于150
    };

    // 计算要显示给用户的折臂角度
    const displayKnuckleAngle = mapKnuckleAngle(data.knuckleAngle);
    
    // Common props for control buttons - Updated for Auto View Switching
    const btnProps = (action: string) => ({
        onMouseDown: () => {
            setActiveControl(action);
            if (['SLEW_CCW', 'SLEW_CW'].includes(action)) {
                setViewMode('TOP');
            } else {
                setViewMode('SIDE');
            }
        },
        onMouseUp: () => setActiveControl(null),
        onMouseLeave: () => setActiveControl(null),
		// ===================================
    // 关键修复 1: 增加触控事件支持
    // ===================================
    onTouchStart: (e: React.TouchEvent) => {
        // 阻止默认行为（如移动端缩放或滚动），确保操作专一性
        e.preventDefault(); 
        setActiveControl(action);
        if (['SLEW_CCW', 'SLEW_CW'].includes(action)) { 
            setViewMode('TOP'); 
        } else { 
            setViewMode('SIDE'); 
        } 
    },
    onTouchEnd: () => setActiveControl(null),
    onTouchCancel: () => setActiveControl(null), // 触控中断时停止操作
    // ===================================
        className: "absolute z-20 cursor-pointer active:bg-white/20 transition-colors"
    });

    const handleZoomIn = () => setZoom(prev => Math.min(2, prev + 0.1));
    const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.1));
    const handleResetZoom = () => setZoom(1);

    return (
    <div className="h-full flex flex-col bg-gray-300 p-4 rounded relative overflow-hidden">
        <div className="bg-white p-2 flex justify-between items-center border-b border-gray-400 mb-4 rounded shadow-sm">
            <div className="flex items-center gap-4">
               <div className="flex items-center">
                   <KTSLogo /> {/* 假设 KTSLogo 是已定义的组件 */}
               </div>
               <div className="h-6 w-px bg-gray-300"></div>
               <div className="font-mono font-bold text-lg">{new Date().toLocaleString()}</div>
            </div>
            {/* Clear Button with Functionality */}
            <button 
                className="bg-gray-700 text-white px-3 py-1 text-xs rounded uppercase font-bold hover:bg-gray-800 active:scale-95 transition-transform"
                onClick={clearAlarm}
            >
                {t.clear}
            </button>
        </div>

        {/* SWAPPED: Visual Display Area is now flex-1 (Large) */}
        <div className="flex-1 bg-gradient-to-b from-gray-200 to-gray-300 border border-gray-400 p-4 rounded-lg mb-4 flex justify-between items-center shadow-inner min-h-0 relative">
            {/* Visual Container */}
            <div className="flex-1 h-full mx-4 bg-white/50 rounded border border-gray-300 flex items-center justify-center overflow-hidden relative">
                <CraneVisual 
                    angle={data.mainAngle} 
                    ropeLength={data.ropeLength} 
                    activeAlarm={!!activeAlarm} 
                    knuckleAngle={data.knuckleAngle} // 保持原始值不变，用于动画计算
                    slewAngle={data.slewAngle}
                    viewMode={viewMode}
                    weight={data.liftingWeight}
                    speed={data.speed}
                    zoom={zoom}
                    // 💡 传递修正后的映射角度用于显示
                    displayKnuckleAngle={displayKnuckleAngle} 
                />

                {/* Zoom Controls Overlay */}
                <div className="absolute right-4 top-4 flex flex-col gap-2 z-20 bg-black/40 p-2 rounded-lg backdrop-blur-sm border border-white/20">
                    <button 
                        onClick={handleZoomIn} 
                        className="bg-white/90 hover:bg-white text-gray-800 p-1.5 rounded shadow transition-transform active:scale-95"
                        title={t.zoomIn}
                    >
                        <ZoomIn size={18} /> {/* 假设 ZoomIn 是已定义的图标组件 */}
                    </button>
                    <button 
                        onClick={handleResetZoom} 
                        className="bg-white/90 hover:bg-white text-gray-800 p-1.5 rounded shadow transition-transform active:scale-95"
                        title={t.zoomReset}
                    >
                        <Maximize size={18} /> {/* 假设 Maximize 是已定义的图标组件 */}
                    </button>
                    <button 
                        onClick={handleZoomOut} 
                        className="bg-white/90 hover:bg-white text-gray-800 p-1.5 rounded shadow transition-transform active:scale-95"
                        title={t.zoomOut}
                    >
                        <ZoomOut size={18} /> {/* 假设 ZoomOut 是已定义的图标组件 */}
                    </button>
                    <div className="text-[10px] font-bold text-white text-center mt-1 font-mono">
                        {Math.round(zoom * 100)}%
                    </div>
                </div>

                {activeAlarm && (
                    <div className="absolute inset-x-10 top-2 bg-red-600 text-white text-center p-1 text-xs font-bold animate-pulse shadow-lg border-2 border-yellow-400 z-10">
                        {alarmMsg}
                    </div>
                )}
            </div>
            {/* Removed right panel, merged into Visual */}
        </div>

        {/* SWAPPED: Controls Area is now fixed height (Smaller) */}
        <div className="h-72 bg-[#4b5563] rounded-xl p-6 flex items-center justify-center relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] shrink-0">
            <div className="w-full max-w-4xl grid grid-cols-3 gap-12">
                
                <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 bg-[#1f2937] rounded-full border-4 border-gray-600 shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
                        <span className="absolute top-4 text-[9px] text-gray-400 font-bold uppercase pointer-events-none">{t.luffingDw}</span>
                        <span className="absolute bottom-4 text-[9px] text-gray-400 font-bold uppercase pointer-events-none">{t.luffingUp}</span>
                        <span className="absolute left-0 text-[9px] text-gray-400 font-bold uppercase w-12 text-center leading-3 whitespace-pre-line pointer-events-none">{t.slewingCcw}</span>
                        <span className="absolute right-0 text-[9px] text-gray-400 font-bold uppercase w-12 text-center leading-3 whitespace-pre-line pointer-events-none">{t.slewingCw}</span>

                        <div className="w-20 h-20 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-[0_5px_10px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.2)] flex items-center justify-center relative z-10 pointer-events-none">
                            <div className="w-14 h-14 bg-gradient-to-tr from-red-900 to-red-600 rounded-full border-2 border-red-400 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"></div>
                        </div>

                        <button {...btnProps('LUFF_DOWN')} className="absolute top-0 w-full h-1/3 z-20 active:bg-white/10 rounded-t-full" />
                        <button {...btnProps('LUFF_UP')} className="absolute bottom-0 w-full h-1/3 z-20 active:bg-white/10 rounded-b-full" />
                        <button {...btnProps('SLEW_CCW')} className="absolute left-0 w-1/3 h-full z-20 active:bg-white/10 rounded-l-full" />
                        <button {...btnProps('SLEW_CW')} className="absolute right-0 w-1/3 h-full z-20 active:bg-white/10 rounded-r-full" />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex gap-4 mb-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-500 shadow flex items-center justify-center">
                                <div className="w-1 h-5 bg-white rounded transform rotate-45"></div>
                            </div>
                        ))}
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-400 rounded flex items-center justify-center shadow-lg border border-gray-500">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-white rounded-full border border-gray-300 shadow-inner"></div>
                    </div>
                    <div className="flex gap-2 w-full mt-2">
                         <button 
                            onClick={() => setViewMode('TOP')}
                            className={`flex-1 text-[10px] font-bold py-2 rounded border-b-4 active:border-0 active:mt-1 ${viewMode === 'TOP' ? 'bg-cyan-500 text-white border-cyan-700' : 'bg-gray-600 text-gray-200 border-gray-800'}`}
                        >
                            {t.top}
                        </button>
                         <button 
                            onClick={() => setViewMode('SIDE')}
                            className={`flex-1 text-[10px] font-bold py-2 rounded border-b-4 active:border-0 active:mt-1 ${viewMode === 'SIDE' ? 'bg-cyan-500 text-white border-cyan-700' : 'bg-gray-600 text-gray-200 border-gray-800'}`}
                        >
                            {t.side}
                        </button>
                         <button className="flex-1 bg-red-600 text-white text-[10px] font-bold py-2 rounded border-b-4 border-red-800 active:border-0 active:mt-1">{t.exit}</button>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 bg-[#1f2937] rounded-full border-4 border-gray-600 shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center">
                        <span className="absolute top-4 text-[9px] text-gray-400 font-bold uppercase pointer-events-none">{t.hoistingDw}</span>
                        <span className="absolute bottom-4 text-[9px] text-gray-400 font-bold uppercase pointer-events-none">{t.hoistingUp}</span>
                        <span className="absolute left-0 text-[9px] text-gray-400 font-bold uppercase w-12 text-center leading-3 whitespace-pre-line pointer-events-none">{t.knuckleIn}</span>
                        <span className="absolute right-0 text-[9px] text-gray-400 font-bold uppercase w-12 text-center leading-3 whitespace-pre-line pointer-events-none">{t.knuckleOut}</span>

                         <div className="w-20 h-20 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-[0_5px_10px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.2)] flex items-center justify-center relative z-10 pointer-events-none">
                            <div className="w-14 h-14 bg-gradient-to-tr from-red-900 to-red-600 rounded-full border-2 border-red-400 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"></div>
                        </div>

                        <button {...btnProps('HOIST_DOWN')} className="absolute top-0 w-full h-1/3 z-20 active:bg-white/10 rounded-t-full" />
                        <button {...btnProps('HOIST_UP')} className="absolute bottom-0 w-full h-1/3 z-20 active:bg-white/10 rounded-b-full" />
                        <button {...btnProps('KNUCKLE_IN')} className="absolute left-0 w-1/3 h-full z-20 active:bg-white/10 rounded-l-full" />
                        <button {...btnProps('KNUCKLE_OUT')} className="absolute right-0 w-1/3 h-full z-20 active:bg-white/10 rounded-r-full" />
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

function ParameterView({ data, params, saveParameter, setCurrentView, language }: any) {
    const [subView, setSubView] = useState<'menu' | 'detail'>('menu');
    const [selectedParam, setSelectedParam] = useState<string>('');
    const [localParams, setLocalParams] = useState(params);
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

    if (subView === 'detail') {
        return (
            <div className="flex flex-col h-full bg-[#2a2a2a] p-10 items-center animate-in fade-in">
                 <div className="w-full max-w-3xl bg-[#333] border border-gray-600 rounded-lg overflow-hidden shadow-2xl">
                     <div className="bg-[#87CEEB] p-4 text-center border-b border-gray-500">
                         <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider">{selectedParam}</h2>
                     </div>
                     
                     <div className="p-12 space-y-8 bg-[#333]">
                          <div className="flex items-center justify-center gap-6">
                              <label className="text-white font-bold w-48 text-right">{t.liftingWeight}:</label>
                              <div className="bg-white text-black font-bold px-4 py-2 w-full max-w-xs sm:w-32 text-center border-2 border-gray-400">{data.liftingWeight.toFixed(1)} T</div>
                          </div>

                          <div className="h-px bg-gray-600 w-3/4 mx-auto"></div>

                          <div className="flex items-center justify-center gap-6">
                              <label className="text-white font-bold w-48 text-right">{t.liftingWeightLimit}:</label>
                              <input 
                                type="number" 
                                className="bg-yellow-400 text-black font-bold px-4 py-2 w-full max-w-xs sm:w-32 text-center border-2 border-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={localParams.liftingWeightLimit}
                                onChange={(e) => setLocalParams({...localParams, liftingWeightLimit: parseFloat(e.target.value)})}
                              />
                              <span className="text-gray-400 font-bold">T</span>
                          </div>

                          <div className="flex items-center justify-center gap-6">
                              <label className="text-white font-bold w-48 text-right">{t.warning90}:</label>
                              <input 
                                type="number" 
                                className="bg-yellow-400 text-black font-bold px-4 py-2 w-full max-w-xs sm:w-32 text-center border-2 border-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={localParams.warning90}
                                onChange={(e) => setLocalParams({...localParams, warning90: parseFloat(e.target.value)})}
                              />
                              <span className="text-gray-400 font-bold">T</span>
                          </div>

                          <div className="flex items-center justify-center gap-6">
                              <label className="text-white font-bold w-48 text-right">{t.alarm110}:</label>
                              <input 
                                type="number" 
                                className="bg-red-600 text-white font-bold px-4 py-2 w-32 text-center border-2 border-red-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={localParams.alarm110}
                                onChange={(e) => setLocalParams({...localParams, alarm110: parseFloat(e.target.value)})}
                              />
                              <span className="text-gray-400 font-bold">T</span>
                          </div>
                     </div>

                     <div className="bg-[#444] p-4 flex justify-end gap-4 border-t border-gray-600">
                         <button onClick={() => saveParameter(localParams)} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-bold shadow flex items-center gap-2">
                             <Save size={18} /> {t.save}
                         </button>
                         <button onClick={() => setSubView('menu')} className="bg-[#87CEEB] hover:bg-sky-300 text-slate-800 px-6 py-2 rounded font-bold shadow">
                             {t.back}
                         </button>
                     </div>
                 </div>
            </div>
        )
    }

    return (
      <div className="h-full flex flex-col p-10 items-center justify-center bg-[#f0f9ff]">
         <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-blue-200 overflow-hidden">
             <div className="bg-[#87CEEB] p-4 text-center border-b border-blue-300">
                <h3 className="text-xl text-slate-800 font-bold uppercase tracking-wider">{t.paramSelector}</h3>
             </div>
             <div className="p-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[t.liftingWeight, t.speed, t.workAngle, t.statAlarm, t.hoist, t.knuckle, t.slew, t.luffing].map((item, idx) => (
                    <button 
                        key={idx}
                        onClick={() => { setSelectedParam(item); setSubView('detail'); }}
                        className={`
                            h-16 rounded-lg shadow-md border font-bold text-white uppercase tracking-widest transition-transform active:scale-95
                            bg-[#87CEEB] border-blue-400 hover:bg-blue-300 text-slate-900 ring-4 ring-blue-100
                        `}
                    >
                        {item}
                    </button>
                ))}
            </div>
            <div className="p-4 bg-gray-50 text-right">
                <button onClick={() => setCurrentView(ViewState.DASHBOARD)} className="bg-[#87CEEB] px-8 py-2 rounded shadow font-bold text-slate-800 hover:bg-blue-300">{t.back}</button>
            </div>
         </div>
      </div>
    );
}

function RecordView({ type, setCurrentView, saveRecord, language, records }: any) {
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
    const [view, setView] = useState<'list' | 'entry'>('list');
    const [formData, setFormData] = useState({
        component: '',
        partName: '',
        description: '',
        employee: ''
    });

    const handleSubmit = () => {
        const newRecord: MaintenanceEntry = {
            id: Date.now().toString(),
            type: type,
            component: formData.component,
            partName: formData.partName,
            description: formData.description,
            employee: formData.employee,
            date: new Date().toLocaleDateString('en-GB'),
            time: new Date().toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})
        };
        saveRecord(newRecord);
        setView('list');
        setFormData({ component: '', partName: '', description: '', employee: '' });
    };

    const filteredRecords = records ? records.filter((r: MaintenanceEntry) => r.type === type) : [];

    return (
        <div className="h-full bg-gray-100 p-6 flex flex-col gap-4">
             <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                 <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                     <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                     {type === 'Maintenance' ? t.maintenanceRecord : t.repairRecord}
                 </h2>
                 <div className="flex gap-2">
                     <button 
                        onClick={() => setView('list')} 
                        className={`px-4 py-2 rounded font-bold ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                     >
                        {t.viewHistory}
                     </button>
                     <button 
                        onClick={() => setView('entry')} 
                        className={`px-4 py-2 rounded font-bold ${view === 'entry' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                     >
                        {t.recordEntry}
                     </button>
                     <button onClick={() => setCurrentView(ViewState.LANDING)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-bold text-gray-700">{t.back}</button>
                 </div>
             </div>

             {view === 'list' ? (
                 <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                     <div className="overflow-auto flex-1">
                         <table className="w-full text-left">
                             <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs border-b border-gray-200 sticky top-0">
                                 <tr>
                                     <th className="p-4">{t.date}</th>
                                     <th className="p-4">{t.time}</th>
                                     <th className="p-4">{t.parts}</th>
                                     <th className="p-4">{t.partName}</th>
                                     <th className="p-4">{t.jobContent}</th>
                                     <th className="p-4">Employee</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-gray-100">
                                 {filteredRecords.map((rec: MaintenanceEntry) => (
                                     <tr key={rec.id} className="hover:bg-blue-50 transition-colors">
                                         <td className="p-4 font-mono text-sm text-gray-500">{rec.date}</td>
                                         <td className="p-4 font-mono text-sm text-gray-500">{rec.time}</td>
                                         <td className="p-4 font-bold text-slate-700">{rec.component}</td>
                                         <td className="p-4 text-slate-600">{rec.partName}</td>
                                         <td className="p-4 text-slate-600">{rec.description}</td>
                                         <td className="p-4 text-slate-600">{rec.employee}</td>
                                     </tr>
                                 ))}
                                 {filteredRecords.length === 0 && (
                                     <tr><td colSpan={6} className="p-8 text-center text-gray-400 italic">No records found.</td></tr>
                                 )}
                             </tbody>
                         </table>
                     </div>
                     <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                         <button className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-100 px-4 py-2 rounded">
                             <Download size={18}/> {t.exportOrder}
                         </button>
                     </div>
                 </div>
             ) : (
                 <div className="flex-1 bg-white rounded-lg shadow-sm p-8 flex justify-center overflow-auto">
                     <div className="w-full max-w-2xl space-y-6">
                         <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-2">
                                 <label className="font-bold text-gray-700">{t.parts}</label>
                                 <input 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                                    value={formData.component}
                                    onChange={e => setFormData({...formData, component: e.target.value})}
                                    placeholder="e.g. Main Hoist"
                                 />
                             </div>
                             <div className="space-y-2">
                                 <label className="font-bold text-gray-700">{t.partName}</label>
                                 <input 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.partName}
                                    onChange={e => setFormData({...formData, partName: e.target.value})}
                                    placeholder="e.g. Brake Pads"
                                 />
                             </div>
                         </div>
                         <div className="space-y-2">
                             <label className="font-bold text-gray-700">{t.jobContent}</label>
                             <textarea 
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder={t.descriptionPlaceholder}
                             />
                         </div>
                         <div className="space-y-2">
                             <label className="font-bold text-gray-700">Employee / Operator</label>
                             <input 
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.employee}
                                onChange={e => setFormData({...formData, employee: e.target.value})}
                                placeholder="Name"
                             />
                         </div>
                         <div className="pt-4 flex gap-4">
                             <button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded font-bold shadow-lg transition-transform active:scale-95">
                                 {t.save}
                             </button>
                             <button onClick={() => setView('list')} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded font-bold">
                                 Cancel
                             </button>
                         </div>
                     </div>
                 </div>
             )}
        </div>
    )
}

function ToDoView({ data, setCurrentView, language }: any) {
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
    const [zoom, setZoom] = useState(1);
    const [selectedTask, setSelectedTask] = useState(1);
    
    // Hardcoded tasks for demo
    const tasks = [
        { id: 1, title: 'Check Main Hoist Wire Rope', status: 'Pending', priority: 'High', date: '2025-11-12' },
        { id: 2, title: 'Inspect Hydraulic Pump Pressure', status: 'Pending', priority: 'Medium', date: '2025-11-13' },
        { id: 3, title: 'Lubricate Knuckle Joint', status: 'Pending', priority: 'Low', date: '2025-11-14' },
    ];

    // =========================================================================
    // 💡 1. 复制并定义反向线性映射函数：将 [-70, 43] 反向映射到 [150, 30]
    //    确保显示值与 RemoteControlView/DashboardView 同步。
    // =========================================================================
    const mapKnuckleAngle = (knuckleAngle) => {
        const inMin = -70;   // 原始数据的最小值 (对应显示 150°)
        const inMax = 43;    // 原始数据的最大值 (对应显示 30°)
        const outMin = 150;  // 目标显示值 (当原始值为 inMin 时)
        const outMax = 30;   // 目标显示值 (当原始值为 inMax 时)

        const inputRange = inMax - inMin; // 113
        const outputRange = outMax - outMin; // -120
        
        if (inputRange === 0) return outMin;

        // 线性映射公式
        const mappedAngle = outMin + outputRange * (knuckleAngle - inMin) / inputRange;

        // 限制结果在 [30, 150] 范围内
        return Math.min(Math.max(mappedAngle, outMax), outMin); 
    };

    // 💡 2. 计算要显示给 CraneVisual 的折臂角度
    const displayKnuckleAngle = mapKnuckleAngle(data.knuckleAngle);
    
    // --- Zoom handlers (保持不变) ---
    const handleZoomIn = () => setZoom(prev => Math.min(2, prev + 0.1));
    const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.1));
    const handleResetZoom = () => setZoom(1);

    return (
        <div className="h-full bg-gray-100 p-6 flex gap-6">
            {/* Left List */}
            <div className="w-80 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden border border-gray-200">
                <div className="p-4 border-b border-gray-200 bg-emerald-50 flex justify-between items-center">
                    <h3 className="font-bold text-emerald-800">{t.statTodo}</h3>
                    <div className="bg-emerald-200 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">3</div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {tasks.map(task => (
                        <div 
                            key={task.id} 
                            onClick={() => setSelectedTask(task.id)}
                            className={`p-3 rounded border transition-all cursor-pointer ${
                                selectedTask === task.id 
                                ? 'bg-emerald-100 border-emerald-500 shadow-sm' 
                                : 'bg-white border-gray-100 hover:border-emerald-300'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                    task.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                                }`}>{task.priority}</span>
                                <span className="text-xs text-gray-400">{task.date}</span>
                            </div>
                            <div className="text-sm font-bold text-slate-700">{task.title}</div>
                        </div>
                    ))}
                </div>
                <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
                    <button onClick={() => setCurrentView(ViewState.LANDING)} className="text-sm font-bold text-gray-500 hover:text-gray-700 flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> {t.back}
                    </button>
                </div>
            </div>

            {/* Right Visual */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-1 flex flex-col border border-gray-200 relative">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-2 rounded shadow border border-gray-200">
                     <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Visual Inspection</div>
                     <div className="font-bold text-emerald-700">{tasks.find(t => t.id === selectedTask)?.title}</div>
                </div>

                <div className="flex-1 bg-slate-100 rounded overflow-hidden relative border border-slate-200">
                    <CraneVisual 
                        angle={data.mainAngle} 
                        ropeLength={data.ropeLength} 
                        activeAlarm={false} 
                        knuckleAngle={data.knuckleAngle} // 动画使用原始值
                        slewAngle={data.slewAngle}
                        viewMode="SIDE"
                        weight={2.1}
                        zoom={zoom}
                        // 💡 3. 将映射后的角度传递给 CraneVisual 用于显示
                        displayKnuckleAngle={displayKnuckleAngle} 
                    />
                    
                    {/* Zoom Controls */}
                    <div className="absolute right-4 bottom-4 flex flex-col gap-2">
                        <div className="bg-white p-1 rounded-lg shadow-lg border border-gray-200 flex flex-col gap-1">
                            <button onClick={handleZoomIn} className="p-2 hover:bg-emerald-50 text-slate-700 rounded transition-colors" title="Zoom In"><ZoomIn size={20}/></button>
                            <button onClick={handleResetZoom} className="p-2 hover:bg-emerald-50 text-slate-700 rounded transition-colors" title="Reset"><Maximize size={20}/></button>
                            <button onClick={handleZoomOut} className="p-2 hover:bg-emerald-50 text-slate-700 rounded transition-colors" title="Zoom Out"><ZoomOut size={20}/></button>
                        </div>
                        <div className="bg-black/50 text-white text-[10px] font-mono text-center py-1 rounded">
                            {Math.round(zoom * 100)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AlarmHistoryView({ alarmHistory, setCurrentView, language }: any) {
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
    return (
        <div className="h-full bg-gray-100 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                 <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                     <span className="w-2 h-8 bg-red-500 rounded-full"></span>
                     {t.alarmWindow}
                 </h2>
                 <button onClick={() => setCurrentView(ViewState.LANDING)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-bold text-gray-700">{t.back}</button>
            </div>
            
            <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                 <div className="overflow-auto flex-1">
                     <table className="w-full text-left">
                         <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs border-b border-gray-200 sticky top-0">
                             <tr>
                                 <th className="p-4">{t.time}</th>
                                 <th className="p-4">{t.alarmCode}</th>
                                 <th className="p-4">{t.text}</th>
                                 <th className="p-4">Type</th>
                                 <th className="p-4">Status</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                             {alarmHistory.map((alarm: Alarm, idx: number) => {
                                 const msg = t.alarms[alarm.code as keyof typeof t.alarms] || alarm.message;
                                 return (
                                 <tr key={idx} className="hover:bg-red-50 transition-colors">
                                     <td className="p-4 font-mono text-sm text-gray-500">{alarm.timestamp}</td>
                                     <td className="p-4 font-bold text-slate-700 font-mono">{alarm.code}</td>
                                     <td className="p-4 text-slate-600">{msg}</td>
                                     <td className="p-4">
                                         <span className={`px-2 py-1 rounded text-xs font-bold ${alarm.type === 'ALARM' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                             {alarm.type}
                                         </span>
                                     </td>
                                     <td className="p-4 text-xs font-bold text-gray-400 uppercase">{alarm.active ? 'Active' : 'Resolved'}</td>
                                 </tr>
                             )})}
                             {alarmHistory.length === 0 && (
                                 <tr><td colSpan={5} className="p-8 text-center text-gray-400 italic">{t.noAlarms}</td></tr>
                             )}
                         </tbody>
                     </table>
                 </div>
            </div>
        </div>
    );
}

function HelpView({ setCurrentView, language }: any) {
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
    return (
        <div className="h-full bg-gray-100 p-6 flex items-center justify-center">
             <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                 <div className="bg-[#00509E] p-8 text-center text-white">
                     <HelpCircle size={64} className="mx-auto mb-4 opacity-80"/>
                     <h2 className="text-3xl font-bold">{t.help} & {t.onSiteService}</h2>
                 </div>
                 <div className="p-10 space-y-8">
                     <div className="flex items-start gap-6">
                         <div className="p-3 bg-blue-50 rounded-full text-[#00509E]"><MapPin size={24}/></div>
                         <div>
                             <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-1">Address</h3>
                             <p className="text-lg font-medium text-slate-800 whitespace-pre-line">{t.address}</p>
                         </div>
                     </div>
                     <div className="flex items-start gap-6">
                         <div className="p-3 bg-blue-50 rounded-full text-[#00509E]"><Phone size={24}/></div>
                         <div>
                             <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-1">24/7 Hotline</h3>
                             <p className="text-lg font-medium text-slate-800">+65 6580 7900</p>
                         </div>
                     </div>
                     <div className="flex items-start gap-6">
                         <div className="p-3 bg-blue-50 rounded-full text-[#00509E]"><Mail size={24}/></div>
                         <div>
                             <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-1">Email Support</h3>
                             <p className="text-lg font-medium text-slate-800">support@kts-energy.com</p>
                         </div>
                     </div>
                 </div>
                 <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                     <button onClick={() => setCurrentView(ViewState.LANDING)} className="px-8 py-3 bg-[#00509E] hover:bg-blue-800 text-white rounded-xl font-bold shadow-lg transition-transform active:scale-95">
                         {t.back}
                     </button>
                 </div>
             </div>
        </div>
    );
}

function SystemLayout({ children, title, currentView, setCurrentView, currentTime, data, setData, language, setLanguage }: any) {
    const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
    return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden font-sans select-none">
      <Header onNavigateHome={() => setCurrentView(ViewState.LANDING)} currentTime={currentTime} language={language} setLanguage={setLanguage} />
      
      <div className="flex flex-1 overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        
        {/* Main Content Area */}
        <main className="flex-1 p-2 md:mr-[200px] relative flex flex-col h-full overflow-hidden">
            {/* Top Bar for View Title */}
            <div className="bg-gradient-to-r from-[#00A8E8]/80 to-transparent text-white px-4 py-2 mb-2 rounded-l border-l-4 border-white shadow-lg flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                     <div className="bg-white p-1 rounded text-[#00A8E8]"><LayoutGrid size={16}/></div>
                     <h2 className="text-lg font-bold uppercase">{title}</h2>
                  </div>
                  
                  {/* Equipment Selector */}
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded border border-white/20">
                    <span className="text-[10px] text-gray-300 uppercase font-bold tracking-wider">{t.equipmentList}</span>
                    <select 
                        className="bg-transparent text-[#00A8E8] font-bold outline-none text-sm cursor-pointer [&>option]:bg-gray-800"
                        onChange={(e) => setData((prev: any) => ({...prev, model: e.target.value}))}
                        value={data.model}
                    >
                      <option value="5T MODEL">{t.crane5T}</option>
                      <option value="15T MODEL">{t.crane15T}</option>
                    </select>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
            </div>
            
            <div className="flex-1 relative overflow-hidden rounded-lg border border-gray-700 bg-gray-900/90 shadow-2xl">
                {children}
            </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-[200px] bg-[#1e293b] border-l border-gray-600 p-2 absolute right-0 top-0 bottom-0 shadow-2xl z-10 flex flex-col justify-between">
            <div className="space-y-1 mt-2">
                <SideButton 
                label={t.remoteControl} 
                icon={Power} 
                active={currentView === ViewState.REMOTE_CONTROL} 
                onClick={() => setCurrentView(ViewState.REMOTE_CONTROL)} 
                />
                <SideButton 
                label={t.parameterSetting} 
                icon={Settings} 
                active={currentView === ViewState.PARAMETER_SETTING} 
                onClick={() => setCurrentView(ViewState.PARAMETER_SETTING)} 
                />
                <SideButton 
                label={t.maintenanceRecord} 
                icon={ClipboardList} 
                active={currentView === ViewState.MAINTENANCE_RECORD} 
                onClick={() => setCurrentView(ViewState.MAINTENANCE_RECORD)} 
                />
                <SideButton 
                label={t.repairRecord} 
                icon={Wrench} 
                active={currentView === ViewState.REPAIR_RECORD} 
                onClick={() => setCurrentView(ViewState.REPAIR_RECORD)} 
                />
                 <SideButton 
                label={t.statAlarm} 
                icon={AlertCircle} 
                active={currentView === ViewState.ALARM_HISTORY} 
                onClick={() => setCurrentView(ViewState.ALARM_HISTORY)} 
                />
                <SideButton 
                label={t.statTodo} 
                icon={CheckSquare} 
                active={currentView === ViewState.TODO_LIST} 
                onClick={() => setCurrentView(ViewState.TODO_LIST)} 
                />
            </div>
            
            <div className="mb-2">
                 <SideButton 
                    label={t.help} 
                    icon={HelpCircle} 
                    active={currentView === ViewState.HELP} 
                    onClick={() => setCurrentView(ViewState.HELP)} 
                    colorClass="from-slate-700 to-slate-800"
                />
            </div>
        </aside>
      </div>
    </div>
  );
}

// --- Main App Component ---

export default function App() {
  // --- Global State ---
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString('en-GB', DATE_OPTIONS));
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [alarmHistory, setAlarmHistory] = useState<Alarm[]>(INITIAL_ALARMS);
  const [records, setRecords] = useState<MaintenanceEntry[]>(INITIAL_RECORDS);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  
  const [activeControl, setActiveControl] = useState<string | null>(null);

  // Equipment Simulation State
  const [data, setData] = useState<EquipmentData>({
    oilTemp: 45.0,
    windSpeed: 12.5,
    liftingWeight: 2.06,
    speed: 0.0, // Initialize speed at 0
    mainAngle: 27.2,
    ropeLength: 2.8,
    workRadius: 9.6,
    model: '5T MODEL',
    status: 'Running',
    slewAngle: 0,
    knuckleAngle: 45
  });

  // Parameters State
  const [params, setParams] = useState<SystemParameters>({
      liftingWeightLimit: 5.1,
      warning90: 4.5,
      alarm110: 5.5
  });

  const clearAlarm = useCallback(() => {
      setActiveAlarm(null);
  }, []);

  // --- Loop for Continuous Control with Speed Logic ---
  useEffect(() => {
      let interval: number;
      if (activeControl) {
          interval = window.setInterval(() => {
              setData(prev => {
                  const newData = { ...prev };
                  let speedVal = 0;

                  switch(activeControl) {
                      case 'HOIST_UP': 
                          newData.ropeLength = Math.max(0, prev.ropeLength - 0.1); 
                          speedVal = 15.0; 
                          break;
                      case 'HOIST_DOWN': 
                          newData.ropeLength += 0.1; 
                          speedVal = 15.0;
                          break;
                      case 'LUFF_UP': 
                          // Updated limit to 50 per user request
                          newData.mainAngle = Math.min(50, prev.mainAngle + 0.5); 
                          speedVal = 0.5; // deg/s
                          break;
                      case 'LUFF_DOWN': 
                          newData.mainAngle = Math.max(0, prev.mainAngle - 0.5); 
                          speedVal = 0.5;
                          break;
                      case 'SLEW_CW': 
                          newData.slewAngle = (prev.slewAngle + 1) % 360; 
                          speedVal = 1.0; // deg/s
                          break;
                      case 'SLEW_CCW': 
                          newData.slewAngle = (prev.slewAngle - 1 + 360) % 360; 
                          speedVal = 1.0;
                          break;
                      case 'KNUCKLE_IN': 
                          // Updated limit to 122 as per user request (Min 50, Max 122)
                          newData.knuckleAngle = Math.min(43, prev.knuckleAngle + 1); 
                          speedVal = 0.8;
                          break;
                      case 'KNUCKLE_OUT': 
                          // Updated limit to 20 as per user request (Min 20, Max 122)
                          newData.knuckleAngle = Math.max(-70, prev.knuckleAngle - 1); 
                          speedVal = 0.8;
                          break;
                  }
                  
                  newData.speed = speedVal; 
                  
                  const rad1 = (newData.mainAngle * Math.PI) / 180;
                  const rad2 = ((newData.mainAngle - newData.knuckleAngle) * Math.PI) / 180;
                  const boom1Proj = 10 * Math.cos(rad1);
                  const boom2Proj = 8 * Math.cos(rad2);
                  newData.workRadius = Math.abs(boom1Proj + boom2Proj);
                  
                  return newData;
              });
          }, 30); 
      } else {
          setData(prev => ({ ...prev, speed: 0 }));
      }
      return () => clearInterval(interval);
  }, [activeControl]);

  // --- Logic Effects ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-GB', DATE_OPTIONS));
      
      // Physics Simulation
      setData(prev => {
          let newTemp = prev.oilTemp + (Math.random() - 0.5) * 0.5;
          // Clamp temp
          if (newTemp > 95) newTemp = 95;
          if (newTemp < 40) newTemp = 40;

          return {
            ...prev,
            oilTemp: newTemp,
            windSpeed: Math.max(0, Math.min(30, prev.windSpeed + (Math.random() - 0.5))),
          };
      });

    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check Alarms based on Data
  useEffect(() => {
      if (data.liftingWeight > params.alarm110) {
          triggerAlarm({
              code: 'OVLD 004',
              message: 'Lifting Weight to 110% Lifting Overload.', // Static for fallback, visual update handles logic
              type: 'ALARM',
              timestamp: new Date().toLocaleString(),
              active: true
          });
      } else if (data.oilTemp > 90) {
          triggerAlarm({
              code: 'MSOL-3002',
              message: 'Oil Temperature Too High.',
              type: 'WARNING',
              timestamp: new Date().toLocaleString(),
              active: true
          });
      }
  }, [data.liftingWeight, data.oilTemp, params.alarm110]);

  const triggerAlarm = useCallback((alarm: Alarm) => {
      setActiveAlarm(prev => {
          if (prev?.code === alarm.code) return prev;
          setAlarmHistory(h => [alarm, ...h]);
          return alarm;
      });
  }, []);

  const handleControl = (action: string) => {
      setActiveControl(action);
  };

  const saveParameter = useCallback((newParams: SystemParameters) => {
      setParams(newParams);
      alert("Parameters Saved Successfully!");
  }, []);

  const saveRecord = useCallback((record: MaintenanceEntry) => {
      setRecords(prev => [record, ...prev]);
      alert("Record Saved Successfully!");
      setCurrentView(ViewState.MAINTENANCE_RECORD);
  }, []);


  // --- Main Render Switch ---
  if (currentView === ViewState.LANDING) {
      return (
          <LandingView 
            setCurrentView={setCurrentView} 
            alarmHistory={alarmHistory}
            language={language}
            setLanguage={setLanguage}
          />
      );
  }

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  let currentTitle = currentView.replace('_', ' ');
  if (currentView === ViewState.DASHBOARD) {
      currentTitle = data.model === '5T MODEL' ? t.crane5T : t.crane15T;
  } else if (currentView === ViewState.MAINTENANCE_RECORD) {
      currentTitle = t.maintenanceRecord;
  } else if (currentView === ViewState.REPAIR_RECORD) {
      currentTitle = t.repairRecord;
  } else if (currentView === ViewState.PARAMETER_SETTING) {
      currentTitle = t.parameterSetting;
  } else if (currentView === ViewState.REMOTE_CONTROL) {
      currentTitle = t.remoteControl;
  } else if (currentView === ViewState.ALARM_HISTORY) {
      currentTitle = t.statAlarm;
  } else if (currentView === ViewState.TODO_LIST) {
      currentTitle = t.statTodo;
  } else if (currentView === ViewState.HELP) {
      currentTitle = t.help;
  }

  const activeAlarmCode = activeAlarm ? activeAlarm.code : null;
  const activeAlarmMessage = activeAlarmCode ? (t.alarms[activeAlarmCode as keyof typeof t.alarms] || activeAlarm?.message) : '';

  return (
    <>
        <SystemLayout 
            title={currentTitle}
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentTime={currentTime}
            data={data}
            setData={setData}
            language={language}
            setLanguage={setLanguage}
        >
            {currentView === ViewState.DASHBOARD && <DashboardView data={data} activeAlarm={activeAlarm} setActiveAlarm={setActiveAlarm} language={language} />}
            {currentView === ViewState.REMOTE_CONTROL && <RemoteControlView data={data} params={params} activeAlarm={activeAlarm} setActiveControl={setActiveControl} setCurrentView={setCurrentView} clearAlarm={clearAlarm} language={language} />}
            {currentView === ViewState.PARAMETER_SETTING && <ParameterView data={data} params={params} saveParameter={saveParameter} setCurrentView={setCurrentView} language={language} />}
            {currentView === ViewState.MAINTENANCE_RECORD && <RecordView type="Maintenance" setCurrentView={setCurrentView} saveRecord={saveRecord} language={language} records={records} />}
            {currentView === ViewState.REPAIR_RECORD && <RecordView type="Repair" setCurrentView={setCurrentView} saveRecord={saveRecord} language={language} records={records} />}
            {currentView === ViewState.ALARM_HISTORY && <AlarmHistoryView alarmHistory={alarmHistory} setCurrentView={setCurrentView} language={language} />}
            {currentView === ViewState.TODO_LIST && <ToDoView data={data} setCurrentView={setCurrentView} language={language} />}
            {currentView === ViewState.HELP && <HelpView setCurrentView={setCurrentView} language={language} />}
        </SystemLayout>
        
        <AlarmModal 
            alarm={activeAlarm ? { ...activeAlarm, message: activeAlarmMessage } : null} 
            onClose={() => setActiveAlarm(null)}
            labels={{
                alarmCode: t.alarmCode,
                warningCode: t.warningCode,
                alarmInfo: t.alarmInfo,
                warningInfo: t.warningInfo,
                acknowledge: t.acknowledge
            }}
        />
    </>
  );
}