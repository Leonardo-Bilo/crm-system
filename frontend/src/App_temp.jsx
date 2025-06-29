import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Calendar } from '@/components/ui/calendar.jsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Users, Calendar as CalendarIcon, Bell, BarChart3, Home, Plus, Search, Edit, Trash2, Download, Mail, Tag, CalendarDays, Clock, AlertTriangle, CheckCircle, X, Phone, MapPin, FileText, ShoppingCart, Pencil, Trash, FileSpreadsheet, DollarSign, TrendingUp, Upload, Package, Wrench, Hammer, Truck, Check, ChevronDown, Circle, Settings, Star } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, ComposedChart } from 'recharts'
import './App.css'
import logo from './assets/react.svg'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import {
  Select as Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from './components/ui/select.jsx'
import * as SelectModule from './components/ui/select.jsx';
console.log("DEBUG SELECT EXPORTS", SelectModule);

// Cores para grÃ¡ficos
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

// Hook personalizado para gerenciar modais e prevenir problemas de foco
function useModalState() {
  const [isOpen, setIsOpen] = useState(false)
  
  const open = () => {
    // Prevenir scroll do body quando modal abrir
    document.body.style.overflow = 'hidden'
    setIsOpen(true)
  }
  
  const close = () => {
    // Restaurar scroll do body quando modal fechar
    document.body.style.overflow = 'unset'
    setIsOpen(false)
  }
  
  // Cleanup quando componente desmontar
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])
  
  return { isOpen, open, close }
}

// Componente de navegaÃ§Ã£o
function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/clientes', label: 'Clientes', icon: Users },
    { path: '/produtos', label: 'Produtos', icon: Package },
    { path: '/servicos', label: 'ServiÃ§os', icon: Wrench },
    { path: '/agendamentos', label: 'Agendamentos', icon: CalendarIcon },
    { path: '/lembretes', label: 'Lembretes', icon: Bell },
    { path: '/relatorios', label: 'RelatÃ³rios', icon: BarChart3 }
  ]

  const [open, setOpen] = React.useState(false);
  return (
    <>
      {/* BotÃ£o hambÃºrguer para mobile */}
      <button className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 border border-gray-800 rounded-lg p-3 shadow-lg active:scale-95" style={{minWidth: 44, minHeight: 44}} onClick={() => setOpen(true)}>
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      {/* Menu lateral responsivo */}
      <nav className={`fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-40 transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} md:block`}>
      <div className="flex flex-col h-full">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-white">CRM System</span>
            </div>
            {/* BotÃ£o fechar no mobile */}
            <button className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setOpen(false)}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="#fff" strokeWidth="2" d="M6 6l12 12M6 18L18 6"/></svg>
            </button>
        </div>
        <div className="flex-1 px-3">
          {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
              <button
                    key={item.path}
                  onClick={() => { navigate(item.path); setOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                      isActive
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
                )
              })}
            </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-800">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-medium">AD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-gray-400">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
      {/* Overlay para fechar o menu no mobile */}
      {open && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setOpen(false)}></div>}
    </>
  )
}

// Componente de Dashboard AvanÃ§ado
function Dashboard() {
  const [resumo, setResumo] = useState(null)
  const [vendasPeriodo, setVendasPeriodo] = useState([])
  const [loadingResumo, setLoadingResumo] = useState(true)
  const [loadingVendas, setLoadingVendas] = useState(true)
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth())
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear())

  useEffect(() => {
    carregarResumo()
  }, [])

  useEffect(() => {
    carregarVendasPeriodo()
  }, [mesSelecionado, anoSelecionado])

  const carregarResumo = async () => {
    try {
      setLoadingResumo(true)
      // Carregar resumo
      const resumoResponse = await fetch('/api/relatorios/resumo')
      if (!resumoResponse.ok) throw new Error('HTTP ' + resumoResponse.status)
      const resumoData = await resumoResponse.json()
      // Carregar dados de agendamentos
      const agendamentosResponse = await fetch('/api/relatorios/agendamentos')
      if (!agendamentosResponse.ok) throw new Error('HTTP ' + agendamentosResponse.status)
      const agendamentosData = await agendamentosResponse.json()
      const agendamentos = agendamentosData.dados || []
      const agendamentosAgendados = agendamentos.filter(a => a.status === 'agendado').length
      const agendamentosConcluidos = agendamentos.filter(a => a.status === 'concluido').length
      const agendamentosCancelados = agendamentos.filter(a => a.status === 'cancelado').length
      
      // Carregar dados de vendas para calcular quantidade total
      const vendasResponse = await fetch('/api/relatorios/vendas')
      if (!vendasResponse.ok) throw new Error('HTTP ' + vendasResponse.status)
      const vendasData = await vendasResponse.json()
      const vendas = vendasData.dados || []
      const quantidadeTotalVendas = vendas.reduce((acc, v) => acc + (parseInt(v.quantidade) || 0), 0)
      
      setResumo({
        ...resumoData,
        agendamentos_agendados: agendamentosAgendados,
        agendamentos_concluidos: agendamentosConcluidos,
        agendamentos_cancelados: agendamentosCancelados,
        quantidade_total_vendas: quantidadeTotalVendas
      })
    } catch {
      setResumo(null)
    } finally {
      setLoadingResumo(false)
    }
  }

  const carregarVendasPeriodo = async () => {
    try {
      setLoadingVendas(true)
      // FunÃ§Ã£o para formatar data sem problemas de fuso horÃ¡rio
      const formatarDataParaAPI = (data) => {
        const ano = data.getFullYear()
        const mes = String(data.getMonth() + 1).padStart(2, '0')
        const dia = String(data.getDate()).padStart(2, '0')
        return `${ano}-${mes}-${dia}`
      }
      const dataInicio = new Date(anoSelecionado, mesSelecionado, 1)
      const dataFim = new Date(anoSelecionado, mesSelecionado + 1, 0, 23, 59, 59)
      const vendasPeriodoResponse = await fetch(`/api/relatorios/vendas-periodo?data_inicio=${formatarDataParaAPI(dataInicio)}&data_fim=${formatarDataParaAPI(dataFim)}`)
      if (!vendasPeriodoResponse.ok) throw new Error('HTTP ' + vendasPeriodoResponse.status)
      let vendasPeriodoData = await vendasPeriodoResponse.json()
      if (!Array.isArray(vendasPeriodoData)) vendasPeriodoData = []
      vendasPeriodoData = vendasPeriodoData.sort((a, b) => new Date(a.data) - new Date(b.data))
      // Preencher dias sem vendas
      const diasNoMes = new Date(anoSelecionado, mesSelecionado + 1, 0).getDate()
      const vendasPorDia = {}
      vendasPeriodoData.forEach(v => { if (v.data) vendasPorDia[v.data] = v })
      const vendasCompletas = []
      for (let dia = 1; dia <= diasNoMes; dia++) {
        const data = new Date(anoSelecionado, mesSelecionado, dia)
        const dataStr = formatarDataParaAPI(data)
        if (vendasPorDia[dataStr]) {
          vendasCompletas.push(vendasPorDia[dataStr])
        } else {
          vendasCompletas.push({ data: dataStr, total: 0, quantidade: 0 })
        }
      }
      setVendasPeriodo(vendasCompletas)
    } catch {
      setVendasPeriodo([])
    } finally {
      setLoadingVendas(false)
    }
  }

  if (loadingResumo || loadingVendas) {
    return (
      <div className="p-2 sm:p-4 md:p-8 max-w-full overflow-x-hidden">
        <div className="mb-8 w-full flex flex-col items-center sm:items-start">
          <div className="flex flex-col items-center gap-3 mb-2 sm:flex-row sm:items-center w-full">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg border border-white/10 header-icon-circle">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight text-center sm:text-left flex-1">Dashboard</h2>
          </div>
          <p className="text-gray-400 text-lg w-full text-center sm:text-left">VisÃ£o geral do seu negÃ³cio</p>
        </div>

        {/* Loading apenas nos cards, mantendo header visÃ­vel */}
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 animate-pulse col-span-3">
              <CardContent className="flex flex-col items-center justify-center h-full">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center mb-4 animate-spin">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div className="text-white text-lg">Carregando dashboard...</div>
              </CardContent>
            </Card>
          </div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-4 md:p-8 max-w-full overflow-x-hidden">
      <div className="mb-8 w-full flex flex-col items-center sm:items-start">
        <div className="flex flex-col items-center gap-3 mb-2 sm:flex-row sm:items-center w-full">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg border border-white/10 header-icon-circle">
            <Home className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight text-center sm:text-left flex-1">Dashboard</h2>
        </div>
        <p className="text-gray-400 text-lg w-full text-center sm:text-left">VisÃ£o geral do seu negÃ³cio</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-2 w-full">
        {loadingResumo ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-5 w-24 bg-gray-700 rounded" />
                <div className="h-5 w-5 bg-gray-700 rounded-full" />
            </CardHeader>
            <CardContent>
                <div className="h-8 w-20 bg-gray-700 rounded mb-1" />
                <div className="h-4 w-16 bg-gray-700 rounded" />
              </CardContent>
            </Card>
          ))
        ) : resumo && (
          <>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 w-full max-w-full p-2 sm:p-4 md:p-6 flex flex-col justify-center">
            <CardHeader className="flex flex-col items-center justify-center gap-1 pb-1 px-1 sm:px-2 text-center">
              <Users className="h-7 w-7 text-blue-400 mb-1" />
              <CardTitle className="text-base font-semibold text-blue-300 text-center w-full">Total de Clientes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-0 w-full max-w-full p-0 sm:p-1 text-center">
              <div className="text-4xl font-extrabold text-blue-400 leading-tight text-center">{resumo.total_clientes}</div>
              <span className="text-xs text-blue-300/80 font-medium mt-0.5 text-center">Clientes ativos</span>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 w-full max-w-full p-2 sm:p-4 md:p-6 flex flex-col justify-center">
            <CardHeader className="flex flex-col items-center justify-center gap-1 pb-1 px-1 sm:px-2 text-center">
              <BarChart3 className="h-7 w-7 text-green-400 mb-1" />
              <CardTitle className="text-base font-semibold text-green-300 text-center w-full">Total de Compras</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-0 w-full max-w-full p-0 sm:p-1 text-center">
              <div className="text-4xl font-extrabold text-green-400 leading-tight text-center">R$ {resumo.valor_total_vendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <span className="text-xs text-green-300/80 font-medium mt-0.5 text-center">{resumo.quantidade_total_vendas || resumo.total_compras} vendas realizadas</span>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 w-full max-w-full p-2 sm:p-4 md:p-6 flex flex-col justify-center">
            <CardHeader className="flex flex-col items-center justify-center gap-1 pb-1 px-1 sm:px-2 text-center">
              <CalendarIcon className="h-7 w-7 text-indigo-400 mb-1" />
              <CardTitle className="text-base font-semibold text-indigo-300 text-center w-full">Agendamentos</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-0 w-full max-w-full p-0 sm:p-1 text-center">
              <div className="text-4xl font-extrabold text-indigo-400 leading-tight text-center">{resumo.agendamentos_agendados || 0}</div>
              <span className="text-xs text-indigo-300/80 font-medium mt-0.5 text-center">Agendados</span>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 w-full max-w-full p-2 sm:p-4 md:p-6 flex flex-col justify-center">
            <CardHeader className="flex flex-col items-center justify-center gap-1 pb-1 px-1 sm:px-2 text-center">
              <Bell className="h-7 w-7 text-orange-400 mb-1" />
              <CardTitle className="text-base font-semibold text-orange-300 text-center w-full">Lembretes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-0 w-full max-w-full p-0 sm:p-1 text-center">
              <div className="text-4xl font-extrabold text-orange-400 leading-tight text-center">{resumo.lembretes_pendentes}</div>
              <span className="text-xs text-orange-300/80 font-medium mt-0.5 text-center">Pendentes</span>
            </CardContent>
          </Card>
          </>
      )}
      </div>

      {/* GrÃ¡ficos */}
      <div className="grid gap-2 grid-cols-1 md:grid-cols-2 w-full">
        {/* GrÃ¡fico de Vendas */}
        {loadingVendas ? (
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 animate-pulse">
          <CardHeader>
              <div className="h-6 w-40 bg-gray-700 rounded mb-2" />
              <div className="flex gap-2 mt-2">
                <div className="h-8 w-24 bg-gray-700 rounded" />
                <div className="h-8 w-16 bg-gray-700 rounded" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-56 w-full bg-gray-700 rounded" />
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 w-full max-w-full p-2 sm:p-4 md:p-6">
            <CardHeader className="flex flex-col items-center">
              <CardTitle className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3 text-center drop-shadow-lg mb-1">
                <TrendingUp className="w-7 h-7 text-green-400 drop-shadow" />
              HistÃ³rico de Vendas
            </CardTitle>
              <div className="flex gap-2 mt-2 justify-center">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/></svg>
                  </span>
              <select
                value={mesSelecionado}
                onChange={e => setMesSelecionado(Number(e.target.value))}
                className="pl-8 pr-3 py-2 bg-gray-800/80 border border-indigo-500/40 text-gray-100 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400 w-full max-w-full"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}</option>
                ))}
              </select>
                </div>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/></svg>
                  </span>
              <select
                value={anoSelecionado}
                onChange={e => setAnoSelecionado(Number(e.target.value))}
                className="pl-8 pr-3 py-2 bg-gray-800/80 border border-indigo-500/40 text-gray-100 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-indigo-400 w-full max-w-full"
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const ano = new Date().getFullYear() - i
                  return <option key={ano} value={ano}>{ano}</option>
                })}
              </select>
                </div>
            </div>
          </CardHeader>
          <CardContent>
              <ResponsiveContainer width="100%" minWidth={0} height={220}>
              <ComposedChart data={vendasPeriodo} margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis
                  dataKey="data"
                  tickFormatter={value => {
                    const date = new Date(value + 'T12:00:00')
                    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                  }}
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: '#374151' }}
                  tickLine={{ stroke: '#374151' }}
                />
                <YAxis
                  tickFormatter={value => `R$ ${value.toLocaleString('pt-BR')}`}
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                  axisLine={{ stroke: '#374151' }}
                  tickLine={{ stroke: '#374151' }}
                  domain={[0, 'dataMax']}
                />
                <Tooltip 
                  contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.98)', // slate-800 quase sÃ³lido
                      border: '1.5px solid #a5b4fc', // borda azul clara
                      borderRadius: '14px',
                      boxShadow: '0 12px 32px 0 rgba(0,0,0,0.45)',
                      padding: '18px 24px',
                      color: '#fff',
                      fontSize: '1.08rem',
                      fontWeight: 500,
                      letterSpacing: '0.01em',
                      backdropFilter: 'blur(8px)'
                    }}
                    content={({ label, payload }) => {
                      if (!payload || payload.length === 0) return null;
                      // Filtra apenas o valor da linha (Line) com dataKey 'total'
                      const lineTotal = payload.find(p => p.dataKey === 'total');
                      if (!lineTotal) return null;
                      const date = new Date(label + 'T12:00:00');
                      return (
                        <div>
                          <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.08rem', marginBottom: 4 }}>{date.toLocaleDateString('pt-BR')}</div>
                          <div style={{ color: '#a5b4fc', fontWeight: 700, fontSize: '1.18rem' }}>R$ {Number(lineTotal.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        </div>
                      );
                  }}
                />
                <Legend
                  formatter={value => <span className="text-sm font-medium text-gray-400">{value}</span>}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366F1', stroke: '#1f2937', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#6366F1', stroke: '#1f2937', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke={undefined}
                  fillOpacity={1}
                  fill="url(#colorValor)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        )}

        {/* GrÃ¡fico de Status dos Agendamentos */}
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-gray-600/70 transition-all duration-300">
            <CardHeader className="flex flex-col items-center">
              <CardTitle className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3 text-center drop-shadow-lg mb-1">
                <PieChart className="w-7 h-7 text-indigo-400 drop-shadow" />
              Status dos Agendamentos
            </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
                  <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.18"/>
                    </filter>
                    <radialGradient id="pieBlue" cx="50%" cy="50%" r="80%">
                      <stop offset="10%" stopColor="rgba(37,99,235,1)"/>
                      <stop offset="70%" stopColor="rgba(37,99,235,0.7)"/>
                      <stop offset="100%" stopColor="rgba(37,99,235,0.45)"/>
                    </radialGradient>
                    <radialGradient id="pieGreen" cx="50%" cy="50%" r="80%">
                      <stop offset="10%" stopColor="rgba(34,197,94,1)"/>
                      <stop offset="70%" stopColor="rgba(34,197,94,0.7)"/>
                      <stop offset="100%" stopColor="rgba(34,197,94,0.45)"/>
                    </radialGradient>
                    <radialGradient id="pieRed" cx="50%" cy="50%" r="80%">
                      <stop offset="10%" stopColor="rgba(239,68,68,1)"/>
                      <stop offset="70%" stopColor="rgba(239,68,68,0.7)"/>
                      <stop offset="100%" stopColor="rgba(239,68,68,0.45)"/>
                    </radialGradient>
                  </defs>
                  <Pie
                    data={[
                      { name: 'Agendados', value: resumo?.agendamentos_agendados || 0, color: 'url(#pieBlue)' },
                      { name: 'ConcluÃ­dos', value: resumo?.agendamentos_concluidos || 0, color: 'url(#pieGreen)' },
                      { name: 'Cancelados', value: resumo?.agendamentos_cancelados || 0, color: 'url(#pieRed)' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={48}
                    dataKey="value"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
                      if (value === 0) return null;
                      const RADIAN = Math.PI / 180;
                      // Ajuste para centralizar melhor a label
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.52;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontWeight="900" fontSize={"1.08rem"} style={{textShadow: '0 2px 8px #000b,0 1px 0 #0008'}}>
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                    labelLine={false}
                    animationDuration={900}
                    animationBegin={0}
                  >
                    {[
                      { name: 'Agendados', value: resumo?.agendamentos_agendados || 0, color: 'rgba(37,99,235,0.85)', icon: 'ðŸ“…' },
                      { name: 'ConcluÃ­dos', value: resumo?.agendamentos_concluidos || 0, color: 'rgba(34,197,94,0.85)', icon: 'âœ…' },
                      { name: 'Cancelados', value: resumo?.agendamentos_cancelados || 0, color: 'rgba(239,68,68,0.85)', icon: 'âŒ' }
                    ].map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={
                          entry.name === 'Agendados' ? '#1e40af' : // azul escuro
                          entry.name === 'ConcluÃ­dos' ? '#15803d' : // verde escuro
                          entry.name === 'Cancelados' ? '#b91c1c' : '#334155' // vermelho escuro ou cinza escuro
                        }
                        strokeWidth={4}
                        filter="url(#shadow)"
                        style={{ filter: 'drop-shadow(0 2px 8px rgba(30,41,59,0.45))' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 10px 10px -5px rgb(0 0 0 / 0.3)',
                      padding: '16px 20px',
                      backdropFilter: 'blur(10px)',
                      color: '#ffffff'
                    }}
                    formatter={(value, name, props) => {
                      // props.payload[0].color traz a cor do segmento
                      const color = props && props.payload && props.payload[0] && props.payload[0].color ? props.payload[0].color : '#fff';
                      return [
                        <span style={{ color, fontWeight: 'bold' }}>{name}: {value}</span>
                      ];
                    }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legenda customizada - sÃ³ aparece no desktop */}
              <div className="hidden sm:flex flex-nowrap justify-center gap-3 mt-4 overflow-x-auto max-w-full">
                {(() => {
                  const data = [
                    { name: 'Agendados', value: resumo?.agendamentos_agendados || 0, color: 'rgba(37,99,235,0.85)', icon: 'ðŸ“…' },
                    { name: 'ConcluÃ­dos', value: resumo?.agendamentos_concluidos || 0, color: 'rgba(34,197,94,0.85)', icon: 'âœ…' },
                    { name: 'Cancelados', value: resumo?.agendamentos_cancelados || 0, color: 'rgba(239,68,68,0.85)', icon: 'âŒ' }
                  ];
                  return data.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 shadow-lg border border-gray-700/60 min-w-[110px]">
                      <span className="text-xl" style={{ color: entry.color }}>{entry.icon}</span>
                      <span className="text-base font-extrabold tracking-tight" style={{ color: entry.color }}>{entry.name}</span>
                      <span className="text-gray-100 font-bold text-base ml-auto">{entry.value}</span>
                    </div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}

// Componente de formulÃ¡rio de cliente
function ClienteForm({ cliente, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    notas: '',
    categoria_id: null,
    tag_ids: []
  })
  const [categorias, setCategorias] = useState([])
  const [historicoCompras, setHistoricoCompras] = useState([])
  const [mostrarNovaCompra, setMostrarNovaCompra] = useState(false)
  const [compraEditando, setCompraEditando] = useState(null)
  const [formCompra, setFormCompra] = useState({
    produto_servico: '',
    valor: '',
    quantidade: 1,
    data_compra: '',
    observacoes: ''
  })

  // FunÃ§Ã£o para formatar telefone
  const formatarTelefone = (telefone) => {
    if (!telefone) return telefone
    
    // Remove todos os caracteres nÃ£o numÃ©ricos
    const numeros = telefone.replace(/\D/g, '')
    
    // Se tem pelo menos 10 dÃ­gitos (DDD + nÃºmero)
    if (numeros.length >= 10) {
      // Pega os primeiros 2 dÃ­gitos como DDD
      const ddd = numeros.substring(0, 2)
      // O resto Ã© o nÃºmero
      const numero = numeros.substring(2)
      
      // Formata: (DDD) NÃšMERO
      if (numero.length === 8) { // Telefone fixo
        return `(${ddd}) ${numero.substring(0, 4)}-${numero.substring(4)}`
      } else if (numero.length === 9) { // Celular
        return `(${ddd}) ${numero.substring(0, 5)}-${numero.substring(5)}`
      } else {
        return `(${ddd}) ${numero}`
      }
    }
    
    // Se tem menos de 10 dÃ­gitos, retorna como estÃ¡
    return telefone
  }

  // FunÃ§Ã£o para lidar com mudanÃ§a no telefone
  const handleTelefoneChange = (e) => {
    const valor = e.target.value
    const formatado = formatarTelefone(valor)
    setFormData({ ...formData, telefone: formatado })
  }

  useEffect(() => {
    if (cliente) {
      setFormData({
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        endereco: cliente.endereco,
        notas: cliente.notas,
         categoria_id: cliente.categoria?.id || null,
        tag_ids: cliente.tags?.map(tag => tag.id) || []
      })
      carregarHistoricoCompras(cliente.id)
    } else {
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
        notas: '',
        categoria_id: null,
        tag_ids: []
      })
      setHistoricoCompras([])
    }
    carregarCategorias()
  }, [cliente])

  const carregarCategorias = async () => {
    try {
      const response = await fetch('/api/categorias')
      const data = await response.json()
      setCategorias(data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const carregarHistoricoCompras = async (clienteId) => {
    try {
      const response = await fetch(`/api/historico-compras?cliente_id=${clienteId}`)
      const data = await response.json()
      setHistoricoCompras(data || [])
    } catch (error) {
      console.error('Erro ao carregar histÃ³rico de compras:', error)
      setHistoricoCompras([])
    }
  }

  const editarCompra = (compra) => {
    setCompraEditando(compra)
    setFormCompra({
      produto_servico: compra.produto_servico,
      valor: compra.valor.toString(),
      quantidade: compra.quantidade,
      data_compra: compra.data_compra.slice(0, 10),
      observacoes: compra.observacoes || ''
    })
    setMostrarNovaCompra(true)
  }

  const deletarCompra = async (compraId) => {
    if (confirm('Tem certeza que deseja deletar esta compra?')) {
      // Se for um novo cliente, remover da lista temporÃ¡ria
      if (!cliente) {
        setHistoricoCompras(historicoCompras.filter(c => c.id !== compraId))
        return
      }
      
      // Se for um cliente existente, deletar do backend
      try {
        const response = await fetch(`/api/historico-compras/${compraId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          carregarHistoricoCompras(cliente.id)
          onSave() // Recarregar dados do cliente
        } else {
          alert('Erro ao deletar compra')
        }
      } catch (error) {
        console.error('Erro ao deletar compra:', error)
        alert('Erro ao deletar compra')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = cliente 
        ? `/api/clientes/${cliente.id}`
        : '/api/clientes'
      
      const method = cliente ? 'PUT' : 'POST'
      
      // Preparar dados para envio
      const dadosParaEnvio = {
        ...formData
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosParaEnvio)
      })

      if (response.ok) {
        const clienteData = await response.json()
        
        // Se for um novo cliente e hÃ¡ compras para adicionar
        if (!cliente && historicoCompras.length > 0) {
          // Adicionar as compras ao novo cliente
          for (const compra of historicoCompras) {
            const dadosCompra = {
              cliente_id: clienteData.id,
              produto_servico: compra.produto_servico,
              valor: compra.valor,
              quantidade: compra.quantidade,
              data_compra: compra.data_compra,
              observacoes: compra.observacoes
            }
            
            await fetch('/api/historico-compras', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(dadosCompra)
            })
          }
        }
        
          onSave()
        setFormData({ nome: '', email: '', telefone: '', endereco: '', notas: '', categoria_id: null, tag_ids: [] })
        setHistoricoCompras([])
      } else {
        const error = await response.json()
        alert(error.erro || 'Erro ao salvar cliente')
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
      alert('Erro ao salvar cliente')
    }
  }

  const handleSubmitCompra = async (e) => {
    e.preventDefault()
    
    try {
      // Se for um novo cliente (ainda nÃ£o salvo), salvar temporariamente
      if (!cliente) {
        if (compraEditando) {
          // Editar compra existente na lista temporÃ¡ria
          setHistoricoCompras(historicoCompras.map(c => 
            c.id === compraEditando.id 
              ? {
                  ...c,
                  produto_servico: formCompra.produto_servico,
                  valor: parseFloat(formCompra.valor),
                  quantidade: formCompra.quantidade,
                  data_compra: formCompra.data_compra + 'T12:00:00',
                  observacoes: formCompra.observacoes
                }
              : c
          ))
        } else {
          // Adicionar nova compra Ã  lista temporÃ¡ria
          const novaCompra = {
            id: Date.now(), // ID temporÃ¡rio
            produto_servico: formCompra.produto_servico,
            valor: parseFloat(formCompra.valor),
            quantidade: formCompra.quantidade,
            data_compra: formCompra.data_compra + 'T12:00:00',
            observacoes: formCompra.observacoes
          }
          
          setHistoricoCompras([...historicoCompras, novaCompra])
        }
        
        setMostrarNovaCompra(false)
        setCompraEditando(null)
        setFormCompra({
          produto_servico: '',
          valor: '',
          quantidade: 1,
          data_compra: '',
          observacoes: ''
        })
        return
      }
      
      // Se for um cliente existente, salvar normalmente
      const url = compraEditando 
        ? `/api/historico-compras/${compraEditando.id}`
        : '/api/historico-compras'
      
      const method = compraEditando ? 'PUT' : 'POST'
      
      const dadosCompra = {
        cliente_id: cliente.id,
        produto_servico: formCompra.produto_servico,
        valor: parseFloat(formCompra.valor),
        quantidade: formCompra.quantidade,
        data_compra: formCompra.data_compra + 'T12:00:00',
        observacoes: formCompra.observacoes
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosCompra)
      })

      if (response.ok) {
        setMostrarNovaCompra(false)
        setCompraEditando(null)
        setFormCompra({
          produto_servico: '',
          valor: '',
          quantidade: 1,
          data_compra: '',
          observacoes: ''
        })
        carregarHistoricoCompras(cliente.id)
        onSave() // Recarregar dados do cliente
      } else {
        const error = await response.json()
        alert(error.erro || 'Erro ao salvar compra')
      }
    } catch (error) {
      console.error('Erro ao salvar compra:', error)
      alert('Erro ao salvar compra')
    }
  }

  return (
    <>
      <Dialog open={true} onOpenChange={onCancel}>
        <DialogContent className="bg-gray-800/95 border-gray-700/50 text-white backdrop-blur-md shadow-2xl" onInteractOutside={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {cliente ? 'Editar Cliente' : 'Novo Cliente'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {cliente ? 'Atualize as informaÃ§Ãµes do cliente' : 'Preencha as informaÃ§Ãµes do novo cliente'}
            </DialogDescription>
          </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-gray-700/70 transition-all duration-300"
            required
          />
        </div>
        <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={handleTelefoneChange}
                  className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={formData.categoria_id?.toString() || ''}
                  onValueChange={(value) => setFormData({ ...formData, categoria_id: value === '' ? null : parseInt(value) })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {categorias.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()} className="text-white hover:bg-gray-600">
                        {cat.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">EndereÃ§o</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
        </div>
      </div>
      
            {/* SeÃ§Ã£o de HistÃ³rico de Compras */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">HistÃ³rico de Compras</h3>
                <Button
                  type="button"
                  onClick={() => setMostrarNovaCompra(true)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Compra
                </Button>
              </div>
              
              {historicoCompras.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {historicoCompras.map((compra) => (
                    <div key={compra.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">{compra.produto_servico}</span>
                          <span className="text-green-400 font-semibold">
                            R$ {compra.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-400 mt-1">
                          <span>Qtd: {compra.quantidade}</span>
                          <span>
                            {compra.data_compra ? 
                              (() => {
                                try {
                                  const data = new Date(compra.data_compra)
                                  return isNaN(data.getTime()) ? 'Data invÃ¡lida' : data.toLocaleDateString('pt-BR')
                                } catch {
                                  return 'Data invÃ¡lida'
                                }
                              })() 
                              : 'Data nÃ£o informada'
                            }
                          </span>
                        </div>
                        {compra.observacoes && (
                          <p className="text-sm text-gray-400 mt-1">{compra.observacoes}</p>
                        )}
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => editarCompra(compra)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deletarCompra(compra.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma compra registrada</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                rows={3}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <DialogFooter>
              <Button 
                type="button"
                variant="outline"
                onClick={onCancel}
                className="bg-gray-700/50 text-white hover:bg-gray-600/70 border-gray-600/50 transition-all duration-300"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {cliente ? 'Salvar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Modal para adicionar/editar compra */}
      {mostrarNovaCompra && (
        <Dialog open={mostrarNovaCompra} onOpenChange={() => setMostrarNovaCompra(false)}>
          <DialogContent className="bg-gray-800/95 border-gray-700/50 text-white backdrop-blur-md shadow-2xl" onInteractOutside={e => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>
                {compraEditando ? 'Editar Compra' : 'Nova Compra'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {compraEditando ? 'Atualize as informaÃ§Ãµes da compra' : 'Adicione uma nova compra ao histÃ³rico'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitCompra} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="produto_servico">Produto/ServiÃ§o</Label>
                <Input
                  id="produto_servico"
                  value={formCompra.produto_servico}
                  onChange={(e) => setFormCompra({ ...formCompra, produto_servico: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
                  <Label htmlFor="valor">Valor (R$)</Label>
          <Input
                    id="valor"
            type="number"
            step="0.01"
            min="0"
                    value={formCompra.valor}
                    onChange={(e) => setFormCompra({ ...formCompra, valor: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
          />
        </div>
        <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
          <Input
                    id="quantidade"
            type="number"
                    min="1"
                    value={formCompra.quantidade}
                    onChange={(e) => setFormCompra({ ...formCompra, quantidade: parseInt(e.target.value) || 1 })}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
          />
        </div>
      </div>
      <div className="space-y-2">
                <Label htmlFor="data_compra">Data da Compra</Label>
        <Input
                  id="data_compra"
                  type="date"
                  value={formCompra.data_compra}
                  onChange={(e) => setFormCompra({ ...formCompra, data_compra: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
        />
      </div>
      <div className="space-y-2">
                <Label htmlFor="observacoes">ObservaÃ§Ãµes</Label>
        <Textarea
                  id="observacoes"
                  value={formCompra.observacoes}
                  onChange={(e) => setFormCompra({ ...formCompra, observacoes: e.target.value })}
          rows={3}
                  className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
      <DialogFooter>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setMostrarNovaCompra(false)
                    setCompraEditando(null)
                    setFormCompra({
                      produto_servico: '',
                      valor: '',
                      quantidade: 1,
                      data_compra: '',
                      observacoes: ''
                    })
                  }}
                  className="bg-gray-700 text-white hover:bg-gray-600"
                >
          Cancelar
        </Button>
                <Button 
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {compraEditando ? 'Salvar' : 'Adicionar'}
        </Button>
      </DialogFooter>
    </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

// Componente de listagem de clientes
function ClientesList() {
  const [clientes, setClientes] = useState([])
  const [busca, setBusca] = useState('')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menuOpenCliente, setMenuOpenCliente] = useState(false);

  useEffect(() => {
    carregarClientes()
  }, [busca])

  const carregarClientes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/clientes?busca=${busca}`)
      const data = await response.json()
      setClientes(data.clientes || [])
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      setClientes([])
    } finally {
      setLoading(false)
    }
  }

  const deletarCliente = async (id) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await fetch(`/api/clientes/${id}`, {
          method: 'DELETE'
        })
        carregarClientes()
      } catch (error) {
        console.error('Erro ao deletar cliente:', error)
      }
    }
  }

  const abrirFormularioNovo = () => {
    setClienteEditando(null)
    setDialogAberto(true)
  }

  const abrirFormularioEdicao = (cliente) => {
    setClienteEditando(cliente)
    setDialogAberto(true)
  }

  const exportarExcel = async () => {
    try {
      const response = await fetch('/api/relatorios/exportar/clientes/excel')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'clientes.xlsx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erro ao exportar Excel:', error)
      alert('Erro ao exportar Excel')
    }
  }

  const exportarPDF = async () => {
    try {
      const response = await fetch('/api/relatorios/exportar/clientes/pdf')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'clientes.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      alert('Erro ao exportar PDF')
    }
  }

  // ImportaÃ§Ã£o de Excel
  const inputFileRef = React.useRef(null)
  const importarExcel = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await fetch('/api/clientes/importar-excel', {
        method: 'POST',
        body: formData
      })
      if (response.ok) {
        alert('ImportaÃ§Ã£o realizada com sucesso!')
        carregarClientes()
      } else {
        const error = await response.json()
        alert(error.erro || 'Erro ao importar Excel')
      }
    } catch (error) {
      console.error('Erro ao importar Excel:', error)
      alert('Erro ao importar Excel')
    }
    // Limpar input para permitir novo upload igual
    e.target.value = ''
  }

  return (
    <div className="p-2 sm:p-4 md:p-8 max-w-full overflow-x-hidden">
      <div className="mb-8 w-full flex flex-col items-center sm:items-start">
        <div className="flex flex-col items-center gap-3 mb-2 sm:flex-row sm:items-center w-full">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg border border-white/10 header-icon-circle">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight text-center sm:text-left flex-1">Clientes</h2>
          {/* Mobile: menu dropdown */}
          <div className="relative flex sm:hidden">
            <Button 
                className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-3 py-2 rounded-lg"
                onClick={() => setMenuOpenCliente((open) => !open)}
            >
                <span className="sr-only">Mais opÃ§Ãµes</span>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>
            </Button>
              {menuOpenCliente && (
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpenCliente(false)} />
              )}
              {menuOpenCliente && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <button onClick={() => { exportarExcel(); setMenuOpenCliente(false); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"><FileSpreadsheet className="w-4 h-4 mr-2" />Exportar Excel</button>
                  <button onClick={() => { inputFileRef.current && inputFileRef.current.click(); setMenuOpenCliente(false); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"><Upload className="w-4 h-4 mr-2" />Importar Excel</button>
                  <input type="file" accept=".xlsx,.xls" ref={inputFileRef} onChange={importarExcel} style={{ display: 'none' }} />
                  <button onClick={() => { exportarPDF(); setMenuOpenCliente(false); }} className="w-full flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"><FileText className="w-4 h-4 mr-2" />Exportar PDF</button>
                </div>
              )}
          </div>
          {/* Desktop: botÃµes normais */}
          <div className="hidden sm:flex gap-2">
            <Button onClick={exportarExcel} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"><FileSpreadsheet className="w-4 h-4 mr-2" />Exportar Excel</Button>
            <Button onClick={() => inputFileRef.current && inputFileRef.current.click()} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"><Upload className="w-4 h-4 mr-2" />Importar Excel</Button>
            <input type="file" accept=".xlsx,.xls" ref={inputFileRef} onChange={importarExcel} style={{ display: 'none' }} />
            <Button onClick={exportarPDF} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"><FileText className="w-4 h-4 mr-2" />Exportar PDF</Button>
          </div>
        </div>
        <p className="text-gray-400 text-lg w-full text-center sm:text-left">Gerencie seus clientes</p>
      </div>

      {/* Barra de busca e botÃ£o adicionar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar clientes..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <Button 
          onClick={abrirFormularioNovo}
          className="bg-green-600 hover:bg-green-700 text-white px-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid gap-2 gap-x-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0">
      {loading ? (
          <Card className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 animate-pulse col-span-3">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 flex items-center justify-center mb-4 animate-spin">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-white text-lg">Carregando clientes...</div>
            </CardContent>
          </Card>
      ) : clientes.length === 0 ? (
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 col-span-3">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </h3>
              <p className="text-gray-400 mb-6">
                {busca 
                  ? `Nenhum cliente encontrado para "${busca}". Tente uma busca diferente.`
                  : 'Comece adicionando seu primeiro cliente'
                }
              </p>
              {!busca && (
                <Button 
                  onClick={abrirFormularioNovo}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Cliente
                </Button>
              )}
            </CardContent>
          </Card>
      ) : (
          clientes.map((cliente) => (
            <Card key={cliente.id} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => abrirFormularioEdicao(cliente)}
                      className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1 text-center min-w-0">
                    <CardTitle className="text-lg font-bold text-white group-hover:text-green-300 transition-colors truncate">{cliente.nome}</CardTitle>
                    <CardDescription className="text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors text-sm font-mono">{cliente.email}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deletarCliente(cliente.id)}
                      className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Badges com Melhor Design */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {cliente.categoria && (
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 font-medium shadow-lg shadow-orange-500/20">
                      <Tag className="w-3 h-3 inline mr-1" />
                      {cliente.categoria.nome}
                    </Badge>
                  )}
                  {cliente.valor_total_compras > 0 && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-medium shadow-lg shadow-green-500/20">
                      <DollarSign className="w-3 h-3 inline mr-1" />
                      R$ {cliente.valor_total_compras.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Badge>
                  )}
                  {cliente.quantidade_total_compras > 0 && (
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-medium shadow-lg shadow-blue-500/20">
                      <ShoppingCart className="w-3 h-3 inline mr-1" />
                      {cliente.quantidade_total_compras} compra{cliente.quantidade_total_compras > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                
                {/* InformaÃ§Ãµes de Contato - Destaque */}
                <div className="text-center p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center justify-center text-sm text-emerald-400 mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    {cliente.telefone}
                  </div>
                  {cliente.endereco && (
                    <div className="flex items-center justify-center text-sm text-sky-400">
