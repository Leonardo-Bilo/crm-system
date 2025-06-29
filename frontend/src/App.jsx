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

// Cores para gráficos
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

// Componente de navegação
function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/clientes', label: 'Clientes', icon: Users },
    { path: '/produtos', label: 'Produtos', icon: Package },
    { path: '/servicos', label: 'Serviços', icon: Wrench },
    { path: '/agendamentos', label: 'Agendamentos', icon: CalendarIcon },
    { path: '/lembretes', label: 'Lembretes', icon: Bell },
    { path: '/relatorios', label: 'Relatórios', icon: BarChart3 }
  ]

  const [open, setOpen] = React.useState(false);
  return (
    <>
      {/* Botão hambúrguer para mobile */}
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
            {/* Botão fechar no mobile */}
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

// Componente de Dashboard Avançado
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
      // Função para formatar data sem problemas de fuso horário
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
          <p className="text-gray-400 text-lg w-full text-center sm:text-left">Visão geral do seu negócio</p>
        </div>

        {/* Loading apenas nos cards, mantendo header visível */}
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
        <p className="text-gray-400 text-lg w-full text-center sm:text-left">Visão geral do seu negócio</p>
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

      {/* Gráficos */}
      <div className="grid gap-2 grid-cols-1 md:grid-cols-2 w-full">
        {/* Gráfico de Vendas */}
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
              Histórico de Vendas
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
                      backgroundColor: 'rgba(30, 41, 59, 0.98)', // slate-800 quase sólido
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

        {/* Gráfico de Status dos Agendamentos */}
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
                      { name: 'Concluídos', value: resumo?.agendamentos_concluidos || 0, color: 'url(#pieGreen)' },
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
                      { name: 'Agendados', value: resumo?.agendamentos_agendados || 0, color: 'rgba(37,99,235,0.85)', icon: '📅' },
                      { name: 'Concluídos', value: resumo?.agendamentos_concluidos || 0, color: 'rgba(34,197,94,0.85)', icon: '✅' },
                      { name: 'Cancelados', value: resumo?.agendamentos_cancelados || 0, color: 'rgba(239,68,68,0.85)', icon: '❌' }
                    ].map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={
                          entry.name === 'Agendados' ? '#1e40af' : // azul escuro
                          entry.name === 'Concluídos' ? '#15803d' : // verde escuro
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
              {/* Legenda customizada - só aparece no desktop */}
              <div className="hidden sm:flex flex-nowrap justify-center gap-3 mt-4 overflow-x-auto max-w-full">
                {(() => {
                  const data = [
                    { name: 'Agendados', value: resumo?.agendamentos_agendados || 0, color: 'rgba(37,99,235,0.85)', icon: '📅' },
                    { name: 'Concluídos', value: resumo?.agendamentos_concluidos || 0, color: 'rgba(34,197,94,0.85)', icon: '✅' },
                    { name: 'Cancelados', value: resumo?.agendamentos_cancelados || 0, color: 'rgba(239,68,68,0.85)', icon: '❌' }
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

// Componente de formulário de cliente
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

  // Função para formatar telefone
  const formatarTelefone = (telefone) => {
    if (!telefone) return telefone
    
    // Remove todos os caracteres não numéricos
    const numeros = telefone.replace(/\D/g, '')
    
    // Se tem pelo menos 10 dígitos (DDD + número)
    if (numeros.length >= 10) {
      // Pega os primeiros 2 dígitos como DDD
      const ddd = numeros.substring(0, 2)
      // O resto é o número
      const numero = numeros.substring(2)
      
      // Formata: (DDD) NÚMERO
      if (numero.length === 8) { // Telefone fixo
        return `(${ddd}) ${numero.substring(0, 4)}-${numero.substring(4)}`
      } else if (numero.length === 9) { // Celular
        return `(${ddd}) ${numero.substring(0, 5)}-${numero.substring(5)}`
      } else {
        return `(${ddd}) ${numero}`
      }
    }
    
    // Se tem menos de 10 dígitos, retorna como está
    return telefone
  }

  // Função para lidar com mudança no telefone
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
      console.error('Erro ao carregar histórico de compras:', error)
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
      // Se for um novo cliente, remover da lista temporária
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
        
        // Se for um novo cliente e há compras para adicionar
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
      // Se for um novo cliente (ainda não salvo), salvar temporariamente
      if (!cliente) {
        if (compraEditando) {
          // Editar compra existente na lista temporária
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
          // Adicionar nova compra à lista temporária
          const novaCompra = {
            id: Date.now(), // ID temporário
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
              {cliente ? 'Atualize as informações do cliente' : 'Preencha as informações do novo cliente'}
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
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
        </div>
      </div>
      
            {/* Seção de Histórico de Compras */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Histórico de Compras</h3>
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
                                  return isNaN(data.getTime()) ? 'Data inválida' : data.toLocaleDateString('pt-BR')
                                } catch {
                                  return 'Data inválida'
                                }
                              })() 
                              : 'Data não informada'
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
                {compraEditando ? 'Atualize as informações da compra' : 'Adicione uma nova compra ao histórico'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitCompra} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="produto_servico">Produto/Serviço</Label>
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
                <Label htmlFor="observacoes">Observações</Label>
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
                  className="bg-yellow-500 hover:bg-yellow-600 text-white transition-all flex-1 sm:flex-none"
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

  // Importação de Excel
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
        alert('Importação realizada com sucesso!')
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
                <span className="sr-only">Mais opções</span>
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
          {/* Desktop: botões normais */}
          <div className="hidden sm:flex gap-2">
            <Button onClick={exportarExcel} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"><FileSpreadsheet className="w-4 h-4 mr-2" />Exportar Excel</Button>
            <Button onClick={() => inputFileRef.current && inputFileRef.current.click()} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"><Upload className="w-4 h-4 mr-2" />Importar Excel</Button>
            <input type="file" accept=".xlsx,.xls" ref={inputFileRef} onChange={importarExcel} style={{ display: 'none' }} />
            <Button onClick={exportarPDF} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"><FileText className="w-4 h-4 mr-2" />Exportar PDF</Button>
          </div>
        </div>
        <p className="text-gray-400 text-lg w-full text-center sm:text-left">Gerencie seus clientes</p>
      </div>

      {/* Barra de busca e botão adicionar */}
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
                
                {/* Informações de Contato - Destaque */}
                <div className="text-center p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-center justify-center text-sm text-emerald-400 mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    {cliente.telefone}
                  </div>
                  {cliente.endereco && (
                    <div className="flex items-center justify-center text-sm text-sky-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {cliente.endereco}
                    </div>
                  )}
                </div>
                
                {/* Datas de Compras */}
                  {cliente.datas_compras && cliente.datas_compras.length > 0 && (
                  <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                    <p className="text-xs text-gray-400 mb-2 font-medium text-center">Histórico de Compras</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                          {cliente.datas_compras.map((data, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-gray-700/50 border-gray-600 text-gray-300">
                              {(() => {
                                try {
                                  const dataObj = new Date(data + 'T12:00:00')
                                  return isNaN(dataObj.getTime()) ? 'Data inválida' : dataObj.toLocaleDateString('pt-BR')
                                } catch {
                                  return 'Data inválida'
                                }
                              })()}
                        </Badge>
                      ))}
                      </div>
                    </div>
                  )}
                
                {/* Notas e Observações */}
                {(cliente.notas || cliente.observacoes) && (
                  <div className="space-y-2">
                  {cliente.notas && (
                      <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                        <p className="text-xs text-gray-400 mb-1 font-medium">Notas</p>
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{cliente.notas}</p>
                  </div>
                  )}
                  {cliente.observacoes && (
                      <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                        <p className="text-xs text-gray-400 mb-1 font-medium">Observações</p>
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{cliente.observacoes}</p>
                      </div>
                    )}
                    </div>
                  )}
              </CardContent>
            </Card>
          ))
      )}
      </div>

      {dialogAberto && (
        <ClienteForm
          cliente={clienteEditando}
          onSave={() => {
            setDialogAberto(false)
            setClienteEditando(null)
            carregarClientes()
          }}
          onCancel={() => {
            setDialogAberto(false)
            setClienteEditando(null)
          }}
        />
      )}
    </div>
  )
}

// Componente de agendamentos avançados
function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [agendamentoEditando, setAgendamentoEditando] = useState(null)
  const [formData, setFormData] = useState({
    cliente_id: '',
    titulo: '',
    descricao: '',
    data_agendamento: '',
    data_fim: '',
    tipo: '',
    local: '',
    status: 'agendado'
  })

  useEffect(() => {
    carregarAgendamentos()
    carregarClientes()
  }, [busca])

  const carregarAgendamentos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/agendamentos?busca=${busca}`)
      const data = await response.json()
      setAgendamentos(data || [])
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      setAgendamentos([])
    } finally {
      setLoading(false)
    }
  }

  const carregarClientes = async () => {
    try {
      const response = await fetch('/api/clientes')
      const data = await response.json()
      setClientes(data.clientes || [])
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      setClientes([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = agendamentoEditando 
        ? `/api/agendamentos/${agendamentoEditando.id}`
        : '/api/agendamentos'
      
      const method = agendamentoEditando ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setDialogAberto(false)
        setAgendamentoEditando(null)
        setFormData({
          cliente_id: '',
          titulo: '',
          descricao: '',
          data_agendamento: '',
          data_fim: '',
          tipo: '',
          local: '',
          status: 'agendado'
        })
        carregarAgendamentos()
      } else {
        const error = await response.json()
        alert(error.erro || 'Erro ao salvar agendamento')
      }
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error)
      alert('Erro ao salvar agendamento')
    }
  }

  const handleCancel = () => {
    setDialogAberto(false)
    setAgendamentoEditando(null)
  }

  const deletarAgendamento = async (id) => {
    if (confirm('Tem certeza que deseja deletar este agendamento?')) {
      try {
        await fetch(`/api/agendamentos/${id}`, {
          method: 'DELETE'
        })
        carregarAgendamentos()
      } catch (error) {
        console.error('Erro ao deletar agendamento:', error)
      }
    }
  }

  const abrirFormularioNovo = () => {
    setAgendamentoEditando(null)
    setFormData({
      cliente_id: '',
      titulo: '',
      descricao: '',
      data_agendamento: '',
      data_fim: '',
      tipo: '',
      local: '',
      status: 'agendado'
    })
    setDialogAberto(true)
  }

  const abrirFormularioEdicao = (agendamento) => {
    setAgendamentoEditando(agendamento)
    setFormData({
      cliente_id: agendamento.cliente_id.toString(),
      titulo: agendamento.titulo,
      descricao: agendamento.descricao || '',
      data_agendamento: agendamento.data_agendamento ? agendamento.data_agendamento.slice(0, 16) : '',
      data_fim: agendamento.data_fim ? agendamento.data_fim.slice(0, 16) : '',
      tipo: agendamento.tipo || '',
      local: agendamento.local || '',
      status: agendamento.status || 'agendado'
    })
    setDialogAberto(true)
  }

  return (
    <div className="p-2 sm:p-4 md:p-8 max-w-full overflow-x-hidden">
      <div className="mb-8 w-full flex flex-col items-center sm:items-start">
        <div className="flex flex-col items-center gap-3 mb-2 sm:flex-row sm:items-center w-full">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg header-icon-circle">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight text-center sm:text-left w-full">
            Agendamentos
          </h1>
        </div>
          <p className="text-gray-400 text-lg w-full text-center sm:text-left">Gerencie seus compromissos</p>
      </div>

      {/* Barra de busca e botão adicionar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar agendamentos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500"
          />
        </div>
        <Button 
          onClick={abrirFormularioNovo}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {loading ? (
        <Card className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 animate-pulse">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 flex items-center justify-center mb-4 animate-spin">
              <CalendarIcon className="w-6 h-6 text-white" />
        </div>
            <div className="text-white text-lg">Carregando agendamentos...</div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2 gap-x-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0">
          {agendamentos.length === 0 ? (
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 col-span-3">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  {busca ? 'Nenhum agendamento encontrado' : 'Nenhum agendamento cadastrado'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {busca 
                    ? `Nenhum agendamento encontrado para "${busca}". Tente uma busca diferente.`
                    : 'Comece adicionando seu primeiro agendamento para organizar sua agenda.'
                  }
                </p>
                {!busca && (
                  <Button 
                    onClick={abrirFormularioNovo}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Agendamento
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            agendamentos.map((agendamento) => (
              <Card key={agendamento.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{agendamento.titulo}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {clientes.find(c => c.id === agendamento.cliente_id)?.nome || 'Cliente não encontrado'}
                      </p>
                  </div>
                    <div className="flex gap-1 ml-2">
                    <Button 
                      size="sm"
                        variant="ghost"
                      onClick={() => abrirFormularioEdicao(agendamento)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm"
                        variant="ghost"
                      onClick={() => deletarAgendamento(agendamento.id)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                  <div className="space-y-2 mb-3">
                    {/* Data e Hora */}
                <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-300">
                    {(() => {
                      try {
                        const data = new Date(agendamento.data_agendamento)
                        return isNaN(data.getTime()) ? 'Data inválida' : data.toLocaleString('pt-BR')
                      } catch {
                        return 'Data inválida'
                      }
                    })()}
                      </p>
                </div>
                    
                    {/* Tipo */}
                  <div className="flex items-center gap-2 text-sm">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {agendamento.tipo || 'Não especificado'}
                      </Badge>
                  </div>
                    
                    {/* Status */}
                  <div className="flex items-center gap-2 text-sm">
                      <Circle className="w-4 h-4 text-gray-400" />
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          agendamento.status === 'concluido' 
                            ? 'border-green-600 text-green-400' 
                            : agendamento.status === 'cancelado'
                            ? 'border-red-600 text-red-400'
                            : 'border-yellow-600 text-yellow-400'
                        }`}
                      >
                        {agendamento.status === 'concluido' ? 'Concluído' : 
                         agendamento.status === 'cancelado' ? 'Cancelado' : 
                         agendamento.status === 'agendado' ? 'Agendado' : 
                         agendamento.status || 'Pendente'}
                      </Badge>
                  </div>
                    
                    {/* Local */}
                {agendamento.local && (
                  <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-300 line-clamp-1">{agendamento.local}</p>
                  </div>
                )}
                  </div>
                
                  {/* Descrição */}
                {agendamento.descricao && (
                    <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                      <p className="text-xs text-gray-400 mb-1 font-medium">Descrição</p>
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{agendamento.descricao}</p>
                </div>
                  )}
              </CardContent>
            </Card>
            ))
          )}
        </div>
      )}

      {dialogAberto && (
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent className="bg-gray-900/95 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-md" onInteractOutside={e => e.preventDefault()}>
            <DialogHeader className="border-b border-gray-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                {agendamentoEditando ? 'Editar Agendamento' : 'Novo Agendamento'}
              </DialogTitle>
                  <DialogDescription className="text-gray-400 mt-1">
                    {agendamentoEditando ? 'Atualize as informações do agendamento' : 'Preencha as informações do novo agendamento'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              {/* Seção 1: Informações Básicas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <FileText className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Informações Básicas</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="cliente_id" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                      Cliente *
                    </Label>
                <Select
                  value={formData.cliente_id}
                  onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
                >
                      <SelectTrigger className="h-9 px-3 py-1.5 bg-gray-800/50 border-gray-600 text-white focus:border-cyan-500 focus:ring-cyan-500/20 transition-all">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                      {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id.toString()} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                            👤 {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
              
              <div className="space-y-2">
                    <Label htmlFor="titulo" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Título *
                    </Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      placeholder="Ex: Reunião com cliente, Consulta médica"
                      className="h-9 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                  required
                />
                  </div>
              </div>
              
              <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-gray-300 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Descrição
                  </Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva os detalhes do agendamento, objetivos, observações importantes..."
                  rows={3}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20 transition-all resize-none"
                />
                </div>
              </div>
              
              {/* Seção 2: Data e Horário */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Data e Horário</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="data_agendamento" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Data de Início *
                    </Label>
                  <Input
                    id="data_agendamento"
                    type="datetime-local"
                    value={formData.data_agendamento}
                    onChange={(e) => setFormData({ ...formData, data_agendamento: e.target.value })}
                      className="h-9 bg-gray-800/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                    required
                  />
                </div>
                  
                <div className="space-y-2">
                    <Label htmlFor="data_fim" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      Data de Fim
                    </Label>
                  <Input
                    id="data_fim"
                    type="datetime-local"
                    value={formData.data_fim}
                    onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                      className="h-9 bg-gray-800/50 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                  />
                  </div>
                </div>
              </div>
              
              {/* Seção 3: Detalhes do Evento */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-white">Detalhes do Evento</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="tipo" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Tipo de Evento
                    </Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  >
                      <SelectTrigger className="h-9 px-3 py-1.5 bg-gray-800/50 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/20 transition-all">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="reuniao" className="text-white hover:bg-gray-700 focus:bg-gray-700">🤝 Reunião</SelectItem>
                        <SelectItem value="consulta" className="text-white hover:bg-gray-700 focus:bg-gray-700">👨‍⚕️ Consulta</SelectItem>
                        <SelectItem value="evento" className="text-white hover:bg-gray-700 focus:bg-gray-700">🎉 Evento</SelectItem>
                        <SelectItem value="apresentacao" className="text-white hover:bg-gray-700 focus:bg-gray-700">📊 Apresentação</SelectItem>
                        <SelectItem value="treinamento" className="text-white hover:bg-gray-700 focus:bg-gray-700">📚 Treinamento</SelectItem>
                        <SelectItem value="outro" className="text-white hover:bg-gray-700 focus:bg-gray-700">📋 Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                  
                <div className="space-y-2">
                    <Label htmlFor="local" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Local
                    </Label>
                  <Input
                    id="local"
                    value={formData.local}
                    onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                      placeholder="Ex: Sala de reuniões, Consultório, Online"
                      className="h-9 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 transition-all"
                  />
                  </div>
                </div>
              </div>

              {/* Seção 4: Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <Circle className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Status</h3>
              </div>
              
              <div className="space-y-2">
                  <Label htmlFor="status" className="text-gray-300 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Status do Agendamento
                  </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                    <SelectTrigger className="h-9 px-3 py-1.5 bg-gray-800/50 border-gray-600 text-white focus:border-yellow-500 focus:ring-yellow-500/20 transition-all">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="agendado" className="text-white hover:bg-gray-700 focus:bg-gray-700">📅 Agendado</SelectItem>
                      <SelectItem value="concluido" className="text-white hover:bg-gray-700 focus:bg-gray-700">✅ Concluído</SelectItem>
                      <SelectItem value="cancelado" className="text-white hover:bg-gray-700 focus:bg-gray-700">❌ Cancelado</SelectItem>
                      <SelectItem value="adiado" className="text-white hover:bg-gray-700 focus:bg-gray-700">⏰ Adiado</SelectItem>
                  </SelectContent>
                </Select>
                </div>
              </div>
              
              {/* Footer com Botões */}
              <DialogFooter className="border-t border-gray-700 pt-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all flex-1 sm:flex-none"
                >
                    <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white transition-all flex-1 sm:flex-none"
                >
                    <Check className="w-4 h-4 mr-2" />
                    {agendamentoEditando ? 'Atualizar Agendamento' : 'Criar Agendamento'}
                </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Componente de lembretes avançados
function Lembretes() {
  const [lembretes, setLembretes] = useState([])
  const [busca, setBusca] = useState('')
  const [dialogAberto, setDialogAberto] = useState(false)
  const [lembreteEditando, setLembreteEditando] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_lembrete: '',
    prioridade: 'media',
    status: 'pendente',
    recorrencia: 'nenhuma'
  })

  useEffect(() => {
    carregarLembretes()
  }, [busca])

  const carregarLembretes = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/lembretes?busca=${busca}`)
      const data = await response.json()
      
      // Garantir que os lembretes tenham os campos corretos
      const lembretesProcessados = (data || []).map(lembrete => ({
        ...lembrete,
        status: lembrete.status || (lembrete.concluido ? 'concluido' : 'pendente'),
        concluido: lembrete.concluido || lembrete.status === 'concluido'
      }))
      
      setLembretes(lembretesProcessados)
    } catch (error) {
      console.error('Erro ao carregar lembretes:', error)
      setLembretes([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = lembreteEditando 
        ? `/api/lembretes/${lembreteEditando.id}`
        : '/api/lembretes'
      
      const method = lembreteEditando ? 'PUT' : 'POST'
      
      // Ajustar recorrente e intervalo_recorrencia ao criar novo lembrete
      let dadosParaEnvio = { ...formData }
      if (!lembreteEditando) {
        dadosParaEnvio.recorrente = formData.recorrencia !== 'nenhuma'
        dadosParaEnvio.intervalo_recorrencia = formData.recorrencia !== 'nenhuma' ? formData.recorrencia : null
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosParaEnvio)
      })

      if (response.ok) {
        setDialogAberto(false)
        setLembreteEditando(null)
        setFormData({
          titulo: '',
          descricao: '',
          data_lembrete: '',
          prioridade: 'media',
          status: 'pendente',
          recorrencia: 'nenhuma'
        })
        carregarLembretes()
      } else {
        const error = await response.json()
        alert(error.erro || 'Erro ao salvar lembrete')
      }
    } catch (error) {
      console.error('Erro ao salvar lembrete:', error)
      alert('Erro ao salvar lembrete')
    }
  }

  const deletarLembrete = async (id) => {
    if (confirm('Tem certeza que deseja deletar este lembrete?')) {
      try {
        await fetch(`/api/lembretes/${id}`, {
          method: 'DELETE'
        })
        carregarLembretes()
      } catch (error) {
        console.error('Erro ao deletar lembrete:', error)
      }
    }
  }

  const abrirFormularioNovo = () => {
    setLembreteEditando(null)
    setFormData({
      titulo: '',
      descricao: '',
      data_lembrete: '',
      prioridade: 'media',
      status: 'pendente',
      recorrencia: 'nenhuma'
    })
    setDialogAberto(true)
  }

  const abrirFormularioEdicao = (lembrete) => {
    setLembreteEditando(lembrete)
    setFormData({
      titulo: lembrete.titulo,
      descricao: lembrete.descricao || '',
      data_lembrete: lembrete.data_lembrete ? lembrete.data_lembrete.slice(0, 16) : '',
      prioridade: lembrete.prioridade || 'media',
      status: lembrete.status || 'pendente',
      recorrencia: lembrete.intervalo_recorrencia || 'nenhuma'
    })
    setDialogAberto(true)
  }

  const marcarComoConcluido = async (id) => {
    try {
      const response = await fetch(`/api/lembretes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: 'concluido',
          concluido: true 
        })
      })

      if (response.ok) {
        // Atualizar o estado local imediatamente
        setLembretes(prevLembretes => 
          prevLembretes.map(lembrete => 
            lembrete.id === id 
              ? { ...lembrete, status: 'concluido', concluido: true }
              : lembrete
          )
        )
        console.log('Lembrete marcado como concluído com sucesso')
      } else {
        const errorData = await response.json()
        console.error('Erro ao marcar lembrete como concluído:', errorData)
        alert('Erro ao marcar lembrete como concluído')
      }
    } catch (error) {
      console.error('Erro ao marcar lembrete como concluído:', error)
      alert('Erro ao marcar lembrete como concluído')
    }
  }

  return (
    <div className="p-2 sm:p-4 md:p-8 max-w-full overflow-x-hidden">
      <div className="mb-8 w-full flex flex-col items-center sm:items-start">
        <div className="flex flex-col items-center gap-3 mb-2 sm:flex-row sm:items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg header-icon-circle">
            <Bell className="w-6 h-6 text-white" />
          </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight text-center sm:text-left w-full">
            Lembretes
          </h1>
        </div>
        <p className="text-gray-400 text-lg w-full text-center sm:text-left">Gerencie suas tarefas e lembretes</p>
      </div>

      {/* Barra de busca e botão adicionar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar lembretes..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>
        <Button 
          onClick={abrirFormularioNovo}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Lembrete
        </Button>
      </div>

      {loading ? (
        <Card className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 animate-pulse">
          <CardContent className="flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center mb-4 animate-spin">
              <Bell className="w-6 h-6 text-white" />
        </div>
            <div className="text-white text-lg">Carregando lembretes...</div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2 gap-x-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0">
          {lembretes.length === 0 ? (
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 col-span-3">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  {busca ? 'Nenhum lembrete encontrado' : 'Nenhum lembrete cadastrado'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {busca 
                    ? `Nenhum lembrete encontrado para "${busca}". Tente uma busca diferente.`
                    : 'Comece adicionando seu primeiro lembrete'
                  }
                </p>
                {!busca && (
                  <Button 
                    onClick={abrirFormularioNovo}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Lembrete
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            lembretes.map((lembrete) => (
              <Card key={lembrete.id} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => abrirFormularioEdicao(lembrete)}
                        className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    </div>
                    <div className="flex-1 text-center min-w-0">
                      <CardTitle className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors truncate">{lembrete.titulo}</CardTitle>
                      <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors text-sm font-mono">
                        {lembrete.cliente_nome || 'Lembrete geral'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deletarLembrete(lembrete.id)}
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
                    <Badge 
                      variant="outline" 
                      className={`font-medium shadow-lg ${
                        lembrete.prioridade === 'baixa' ? 'bg-green-500/20 text-green-300 border-green-500/30 shadow-green-500/20' :
                        lembrete.prioridade === 'media' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 shadow-yellow-500/20' :
                        lembrete.prioridade === 'alta' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30 shadow-orange-500/20' :
                        lembrete.prioridade === 'urgente' ? 'bg-red-500/20 text-red-300 border-red-500/30 shadow-red-500/20' :
                        'bg-gray-500/20 text-gray-300 border-gray-500/30'
                      }`}
                    >
                      {lembrete.prioridade === 'baixa' ? '🟢 Baixa' :
                       lembrete.prioridade === 'media' ? '🟡 Média' :
                       lembrete.prioridade === 'alta' ? '🟠 Alta' :
                       lembrete.prioridade === 'urgente' ? '🔴 Urgente' : 'Média'}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`font-medium shadow-lg ${
                        lembrete.status === 'pendente' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 shadow-yellow-500/20' :
                        lembrete.status === 'concluido' ? 'bg-green-500/20 text-green-300 border-green-500/30 shadow-green-500/20' :
                        lembrete.concluido ? 'bg-green-500/20 text-green-300 border-green-500/30 shadow-green-500/20' :
                        'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 shadow-yellow-500/20'
                      }`}
                    >
                      {lembrete.status === 'pendente' ? '⏳ Pendente' :
                       lembrete.status === 'concluido' ? '✅ Concluído' :
                       lembrete.concluido ? '✅ Concluído' : '⏳ Pendente'}
                    </Badge>
                    {lembrete.recorrente && (
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-medium shadow-lg shadow-purple-500/20">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Recorrente
                      </Badge>
                    )}
                  </div>
                  
                  {/* Data do Lembrete - Destaque */}
                  <div className="text-center p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                    <p className="text-xs text-gray-400 mb-1 font-medium">Data do Lembrete</p>
                    <p className="text-lg font-bold text-yellow-400">
                      {(() => {
                        try {
                          if (!lembrete.data_lembrete) return 'Não definida'
                          const data = new Date(lembrete.data_lembrete)
                          return isNaN(data.getTime()) ? 'Data inválida' : data.toLocaleString('pt-BR')
                        } catch {
                          return 'Data inválida'
                        }
                      })()}
                    </p>
                  </div>
                  
                  {/* Informações Adicionais */}
                  {lembrete.recorrente && (
                    <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/30 text-center">
                      <p className="text-xs text-gray-400 mb-1">Intervalo</p>
                      <p className="text-sm font-medium text-purple-400">
                        {lembrete.intervalo_recorrencia}
                      </p>
                    </div>
                  )}
                  
                  {/* Descrição */}
                  {lembrete.descricao && (
                    <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{lembrete.descricao}</p>
                    </div>
                  )}
                  
                  {/* Botão de Concluir */}
                    {(lembrete.status === 'pendente' || !lembrete.concluido) && (
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => marcarComoConcluido(lembrete.id)}
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marcar como Concluído
                      </Button>
                    </div>
                  )}
              </CardContent>
            </Card>
            ))
          )}
        </div>
      )}

      {dialogAberto && (
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogContent className="bg-gray-900/95 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-md" onInteractOutside={e => e.preventDefault()}>
            <DialogHeader className="border-b border-gray-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                {lembreteEditando ? 'Editar Lembrete' : 'Novo Lembrete'}
              </DialogTitle>
                  <DialogDescription className="text-gray-400 mt-1">
                    {lembreteEditando ? 'Atualize as informações do lembrete' : 'Preencha as informações do novo lembrete'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              {/* Seção 1: Informações Básicas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <FileText className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Informações Básicas</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="titulo" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Título *
                    </Label>
                <Input
                  id="titulo"
                      name="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      required
                      placeholder="Ex: Lembrete de Reunião, Pagamento de Conta"
                      className="h-9 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500/20 transition-all"
                />
        </div>
              
              <div className="space-y-2">
                    <Label htmlFor="data_lembrete" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Data do Lembrete *
                    </Label>
                    <Input
                      id="data_lembrete"
                      name="data_lembrete"
                      type="datetime-local"
                      value={formData.data_lembrete}
                      onChange={(e) => setFormData({ ...formData, data_lembrete: e.target.value })}
                      required
                      className="h-9 bg-gray-800/50 border-gray-600 text-white focus:border-orange-500 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-gray-300 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Descrição
                  </Label>
                <Textarea
                  id="descricao"
                    name="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva os detalhes do lembrete, observações importantes, contexto..."
                    rows={3}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20 transition-all resize-none"
                />
                </div>
              </div>
              
              {/* Seção 2: Prioridade e Status */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <Circle className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Prioridade e Status</h3>
              </div>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="prioridade" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Prioridade
                    </Label>
                <Select
                  value={formData.prioridade}
                  onValueChange={(value) => setFormData({ ...formData, prioridade: value })}
                >
                      <SelectTrigger className="h-9 px-3 py-1.5 bg-gray-800/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all">
                    <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="baixa" className="text-white hover:bg-gray-700 focus:bg-gray-700">🟢 Baixa</SelectItem>
                        <SelectItem value="media" className="text-white hover:bg-gray-700 focus:bg-gray-700">🟡 Média</SelectItem>
                        <SelectItem value="alta" className="text-white hover:bg-gray-700 focus:bg-gray-700">🟠 Alta</SelectItem>
                        <SelectItem value="urgente" className="text-white hover:bg-gray-700 focus:bg-gray-700">🔴 Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                      Status
                    </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                      <SelectTrigger className="h-9 px-3 py-1.5 bg-gray-800/50 border-gray-600 text-white focus:border-cyan-500 focus:ring-cyan-500/20 transition-all">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="pendente" className="text-white hover:bg-gray-700 focus:bg-gray-700">⏳ Pendente</SelectItem>
                        <SelectItem value="concluido" className="text-white hover:bg-gray-700 focus:bg-gray-700">✅ Concluído</SelectItem>
                  </SelectContent>
                </Select>
                  </div>
                </div>
              </div>

              {/* Seção 3: Recorrência */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-semibold text-white">Recorrência</h3>
      </div>

              <div className="space-y-2">
                  <Label htmlFor="recorrencia" className="text-gray-300 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Tipo de Recorrência
                  </Label>
                <Select
                  value={formData.recorrencia}
                  onValueChange={(value) => setFormData({ ...formData, recorrencia: value })}
                >
                    <SelectTrigger className="h-9 px-3 py-1.5 bg-gray-800/50 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500/20 transition-all">
                    <SelectValue placeholder="Selecione a recorrência" />
                  </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="nenhuma" className="text-white hover:bg-gray-700 focus:bg-gray-700">❌ Nenhuma</SelectItem>
                      <SelectItem value="diaria" className="text-white hover:bg-gray-700 focus:bg-gray-700">📅 Diária</SelectItem>
                      <SelectItem value="semanal" className="text-white hover:bg-gray-700 focus:bg-gray-700">📅 Semanal</SelectItem>
                      <SelectItem value="mensal" className="text-white hover:bg-gray-700 focus:bg-gray-700">📅 Mensal</SelectItem>
                      <SelectItem value="anual" className="text-white hover:bg-gray-700 focus:bg-gray-700">📅 Anual</SelectItem>
                  </SelectContent>
                </Select>
                  
                  <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm text-gray-300">
                      Lembretes recorrentes serão criados automaticamente após a data definida
                    </span>
                  </div>
                </div>
      </div>

              {/* Footer com Botões */}
              <DialogFooter className="border-t border-gray-700 pt-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setDialogAberto(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all flex-1 sm:flex-none"
                >
                    <X className="w-4 h-4 mr-2" />
                  Cancelar
                      </Button>
                    <Button 
                  type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white transition-all flex-1 sm:flex-none"
                    >
                    <Check className="w-4 h-4 mr-2" />
                    {lembreteEditando ? 'Atualizar Lembrete' : 'Criar Lembrete'}
                    </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Componente de relatórios
function Relatorios() {
  const [dados, setDados] = useState({
    vendas: [],
    agendamentos: [],
    lembretes: []
  })
  const [vendasPeriodo, setVendasPeriodo] = useState([])
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarDados()
    carregarVendasPeriodo(anoSelecionado)
  }, [anoSelecionado])

  const carregarDados = async () => {
    try {
      setLoading(true)
      const [vendasRes, agendamentosRes, lembretesRes] = await Promise.all([
        fetch('/api/relatorios/vendas'),
        fetch('/api/relatorios/agendamentos'),
        fetch('/api/relatorios/lembretes')
      ])

      const [vendas, agendamentos, lembretes] = await Promise.all([
        vendasRes.json(),
        agendamentosRes.json(),
        lembretesRes.json()
      ])

      setDados({
        vendas: (vendas.dados || []),
        agendamentos: (agendamentos.dados || []),
        lembretes: (lembretes.dados || [])
      })
    } catch {
      setDados({ vendas: [], agendamentos: [], lembretes: [] })
    } finally {
      setLoading(false)
    }
  }

  const carregarVendasPeriodo = async (ano) => {
    const data_inicio = `${ano}-01-01`
    const data_fim = `${ano}-12-31`
    try {
      const res = await fetch(`/api/relatorios/vendas-periodo?data_inicio=${data_inicio}&data_fim=${data_fim}`)
      let data = await res.json()
      data = data.sort((a, b) => new Date(a.data) - new Date(b.data))
      setVendasPeriodo(data)
    } catch {
      setVendasPeriodo([])
    }
  }

  // Calcular totais com validação
  const totalVendas = dados.vendas.reduce((acc, v) => acc + (parseFloat(v.valor) || 0), 0)
  const quantidadeVendas = dados.vendas.reduce((acc, v) => acc + (parseInt(v.quantidade) || 0), 0)
  const agendamentosAgendados = dados.agendamentos.filter(a => a.status === 'agendado').length
  const lembretesPendentes = dados.lembretes.filter(l => l.status === 'pendente').length
  // Calcular ticket médio
  const ticketMedio = quantidadeVendas > 0 ? (totalVendas / quantidadeVendas) : 0

  return (
    <div className="p-2 sm:p-4 md:p-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <div className="w-full flex flex-col items-center sm:items-start">
          <div className="flex flex-col items-center gap-3 mb-2 sm:flex-row sm:items-center w-full">
          <div className="w-10 h-10 bg-gradient-to-br from-red-700 via-red-800 to-red-900 rounded-xl flex items-center justify-center shadow-lg header-icon-circle">
            <BarChart3 className="w-6 h-6 text-white" />
        </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight w-full text-center sm:text-left">
            Relatórios
          </h1>
        </div>
          <p className="text-gray-400 text-lg w-full text-center sm:text-left">Acompanhe os principais indicadores</p>
        </div>
      </div>
      
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 animate-pulse col-span-3">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-800 via-red-900 to-red-950 flex items-center justify-center mb-4 animate-spin">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-white text-lg">Carregando relatórios...</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 w-full max-w-full p-2 sm:p-4 md:p-6 flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-lg text-green-300">Total de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  R$ {totalVendas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-green-300/70">
                  {quantidadeVendas} vendas realizadas
                </p>
            </CardContent>
          </Card>
          
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 w-full max-w-full p-2 sm:p-4 md:p-6 flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-lg text-blue-300">Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {dados.agendamentos.length}
                </div>
                <p className="text-sm text-blue-300/70">
                  {agendamentosAgendados} agendados
                </p>
            </CardContent>
          </Card>
          
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 w-full max-w-full p-2 sm:p-4 md:p-6 flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-lg text-orange-300">Lembretes</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {dados.lembretes.length}
              </div>
                <p className="text-sm text-orange-300/70">
                  {lembretesPendentes} pendentes
                </p>
            </CardContent>
          </Card>
          
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 w-full max-w-full p-2 sm:p-4 md:p-6 flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-lg text-purple-300">Ticket Médio</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
                <p className="text-sm text-purple-300/70">
                  valor médio por venda
                </p>
            </CardContent>
          </Card>
        </div>

          <div className="mt-2">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 w-full max-w-full p-2 sm:p-4 md:p-6">
              <CardHeader className="flex flex-col items-center">
                <CardTitle className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent text-center drop-shadow-lg mb-1">Vendas por Período</CardTitle>
                <div className="flex justify-center mt-2">
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
                <ResponsiveContainer width="100%" minWidth={0} height={180}>
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
                        backgroundColor: 'rgba(30, 41, 59, 0.98)',
                        border: '1.5px solid #a5b4fc',
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
          </div>
        </>
      )}
    </div>
  )
}

// Componente de Produtos
function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [categoriasProduto, setCategoriasProduto] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduto, setEditingProduto] = useState(null)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)

  useEffect(() => {
    carregarProdutos()
    carregarCategorias()
  }, [])

  const carregarProdutos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/produtos?tipo=produto')
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos')
      }
      const data = await response.json()
      setProdutos(data.produtos || [])
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      setProdutos([])
    } finally {
      setLoading(false)
    }
  }

  const carregarCategorias = async () => {
    try {
      const response = await fetch('/api/categorias-produto')
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias')
      }
      const data = await response.json()
      // Filtrar apenas categorias de produtos (IDs 1-36)
      const categoriasFiltradas = data.filter(cat => cat.id >= 1 && cat.id <= 36)
      setCategoriasProduto(categoriasFiltradas)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      setCategoriasProduto([])
    }
  }

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(busca.toLowerCase())
  )

  const totalProdutos = produtos.length
  const produtosAtivos = produtos.filter(p => p.status === 'ativo').length
  const valorTotal = produtos.reduce((acc, p) => acc + p.valor_venda, 0)
  const categorias = [...new Set(produtos.map(p => p.categoria?.nome))].length

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    const produtoData = {
      nome: formData.get('nome'),
      codigo: formData.get('codigo'),
      descricao: formData.get('descricao'),
      valor_venda: parseFloat(formData.get('preco')),
      custo: parseFloat(formData.get('custo') || 0),
      fornecedor: formData.get('fornecedor'),
      estoque_atual: parseInt(formData.get('estoque') || 0),
      estoque_minimo: parseInt(formData.get('estoque_minimo') || 0),
      unidade_medida: formData.get('unidade_medida'),
      tempo_entrega: formData.get('tempo_entrega'),
      status: formData.get('status'),
      destaque: formData.get('destaque') === 'on',
      categoria_id: formData.get('categoria') ? parseInt(formData.get('categoria')) : null,
      tipo: 'produto'
    }

    try {
      const url = editingProduto 
        ? `/api/produtos/${editingProduto.id}` 
        : '/api/produtos'
      
      const method = editingProduto ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produtoData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.erro || 'Erro ao salvar produto')
      }

      await carregarProdutos()
      setShowForm(false)
      setEditingProduto(null)
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert(`Erro: ${error.message}`)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProduto(null)
  }

  const deletarProduto = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return
    
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.erro || 'Erro ao deletar produto')
      }
      
      await carregarProdutos()
    } catch (error) {
      console.error('Erro ao deletar produto:', error)
      alert(`Erro: ${error.message}`)
    }
  }

  const abrirFormularioNovo = () => {
    setEditingProduto(null)
    setShowForm(true)
  }

  const abrirFormularioEdicao = (produto) => {
    setEditingProduto(produto)
    setShowForm(true)
  }

  const criarCategoriasPadrao = async () => {
    try {
      const response = await fetch('/api/categorias-produto/criar-padrao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.erro || 'Erro ao criar categorias padrão')
      }
      
      const result = await response.json()
      alert(`✅ ${result.mensagem}\n\n📊 Categorias criadas: ${result.categorias_criadas}\n📊 Categorias existentes: ${result.categorias_existentes}\n📊 Total: ${result.total_categorias}`)
      
      // Recarregar categorias após criar
      await carregarCategorias()
    } catch (error) {
      console.error('Erro ao criar categorias padrão:', error)
      alert(`Erro: ${error.message}`)
    }
  }

  // Opções para o React Select
  const opcoesCategorias = categoriasProduto.map(cat => ({
    value: cat.id,
    label: cat.nome,
    color: cat.cor
  }));

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8 w-full flex flex-col items-center sm:items-start">
          <div className="flex flex-col items-center gap-3 mb-2 sm:flex-row sm:items-center w-full">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg header-icon-circle">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight w-full text-center sm:text-left">
              Produtos
            </h1>
          </div>
          <p className="text-gray-400 text-lg w-full text-center sm:text-left">Gerencie seu catálogo de produtos</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 animate-pulse col-span-3">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 flex items-center justify-center mb-4 animate-spin">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="text-white text-lg">Carregando produtos...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 w-full flex flex-col items-center sm:items-start">
          <div className="flex flex-col items-center gap-3 mb-2 sm:flex-row sm:items-center w-full">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg header-icon-circle">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight w-full text-center sm:text-left">
            Produtos
            </h1>
          </div>
        <p className="text-gray-400 text-lg w-full text-center sm:text-left">Gerencie seu catálogo de produtos</p>
      </div>

      {/* Barra de busca e botão adicionar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
        <Button onClick={abrirFormularioNovo} className="bg-orange-600 hover:bg-orange-700 text-white px-6">
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
          </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
        <div>
                <p className="text-sm text-orange-300">Total de Produtos</p>
                <p className="text-2xl font-bold text-orange-400">{produtos.length}</p>
        </div>
              <Package className="w-8 h-8 text-orange-400" />
        </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
        <div>
                <p className="text-sm text-blue-300">Valor Total</p>
                <p className="text-2xl font-bold text-blue-400">
                  R$ {produtos.reduce((acc, p) => acc + (p.valor_venda * p.estoque_atual), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
        </div>
              <DollarSign className="w-8 h-8 text-blue-400" />
        </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
        <div>
                <p className="text-sm text-orange-300">Em Estoque</p>
                <p className="text-2xl font-bold text-orange-400">
                  {produtos.filter(p => p.estoque_atual > 0).length}
                </p>
        </div>
              <TrendingUp className="w-8 h-8 text-orange-400" />
      </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20 hover:border-red-500/40 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-300">Sem Estoque</p>
                <p className="text-2xl font-bold text-red-400">
                  {produtos.filter(p => p.estoque_atual === 0).length}
                </p>
        </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de produtos */}
      {produtosFiltrados.length === 0 ? (
        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {busca ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </h3>
            <p className="text-gray-400 mb-6">
              {busca 
                ? `Nenhum produto encontrado para "${busca}". Tente uma busca diferente.`
                : 'Comece adicionando seu primeiro produto'
              }
            </p>
            {!busca && (
              <Button 
                onClick={abrirFormularioNovo}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
            )}
            </CardContent>
          </Card>
        ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {produtosFiltrados.map((produto) => (
            <Card key={produto.id} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex gap-1">
                    <Button 
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        abrirFormularioEdicao(produto)
                      }}
                      className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1 text-center min-w-0">
                    <CardTitle className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors truncate">{produto.nome}</CardTitle>
                    <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors text-sm font-mono">{produto.codigo}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        deletarProduto(produto.id)
                      }}
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
                  {/* Status */}
                  {produto.status && (
                    <Badge className={`${
                      produto.status === 'ativo' ? 'bg-green-500/20 text-green-300 border-green-500/30 shadow-lg shadow-green-500/20' :
                      produto.status === 'inativo' ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' :
                      produto.status === 'esgotado' ? 'bg-red-500/20 text-red-300 border-red-500/30 shadow-lg shadow-red-500/20' :
                      'bg-gray-500/20 text-gray-300 border-gray-500/30'
                    } font-medium`}>
                      {produto.status === 'ativo' ? '✓ Ativo' : 
                       produto.status === 'inativo' ? '○ Inativo' : 
                       produto.status === 'esgotado' ? '⚠ Esgotado' : produto.status}
                    </Badge>
                  )}
                  {/* Categoria */}
                  {produto.categoria && (
                    <Badge 
                      className="border-purple-500/30 font-medium shadow-lg"
                      style={{ 
                        backgroundColor: `${produto.categoria.cor}20`, 
                        color: produto.categoria.cor,
                        borderColor: `${produto.categoria.cor}30`,
                        boxShadow: `${produto.categoria.cor}20 0 4px 12px`
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: produto.categoria.cor }}
                        ></div>
                        {produto.categoria.nome || produto.categoria}
                      </div>
                    </Badge>
                  )}
                  {/* Destaque */}
                  {produto.destaque && (
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 font-medium shadow-lg shadow-yellow-500/20">
                      ⭐ Destaque
                    </Badge>
                  )}
                  {/* Estoque Baixo */}
                  {produto.estoque_baixo && (
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 font-medium shadow-lg shadow-orange-500/20">
                      ⚠ Estoque Baixo
                    </Badge>
                  )}
                </div>
                
                {/* Preço Principal - Destaque */}
                <div className="text-center p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                  <p className="text-xs text-gray-400 mb-1 font-medium">Preço de Venda</p>
                  <p className="text-2xl font-bold text-green-400">
                    R$ {produto.valor_venda?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                
                {/* Grid de Informações Principais */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Estoque */}
                  <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/30 text-center">
                    <p className="text-xs text-gray-400 mb-1">Estoque</p>
                    <p className={`text-lg font-bold ${produto.estoque_atual > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                      {produto.estoque_atual}
                    </p>
                    <p className="text-xs text-gray-500">{pluralizarUnidade(produto.unidade_medida || 'Unidade', produto.estoque_atual)}</p>
                  </div>
                  
                  {/* Margem de Lucro */}
                  <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/30 text-center">
                    <p className="text-xs text-gray-400 mb-1">Margem</p>
                    <p className={`text-lg font-bold ${produto.margem_lucro > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {produto.margem_lucro?.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">de lucro</p>
                  </div>
                </div>
                
                {/* Informações Financeiras Detalhadas */}
                <div className="space-y-2 p-3 bg-gray-700/10 rounded-lg border border-gray-700/20">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Custo
                    </span>
                    <span className="text-red-400 font-medium">R$ {produto.custo?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Lucro Unit.
                    </span>
                    <span className="text-green-400 font-medium">R$ {produto.lucro_unitario?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                
                {/* Descrição */}
                {produto.descricao && (
                  <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{produto.descricao}</p>
                  </div>
                )}
                
                {/* Informações Adicionais */}
                {(produto.fornecedor || produto.tempo_entrega) && (
                  <div className="text-xs text-gray-400 space-y-2 pt-3 border-t border-gray-700/50">
                    {produto.fornecedor && (
                      <div className="flex items-center gap-2 justify-center p-2 bg-gray-700/20 rounded-lg">
                        <Truck className="w-3 h-3 text-blue-400" />
                        <span className="font-medium">{produto.fornecedor}</span>
                      </div>
                    )}
                    {produto.tempo_entrega && (
                      <div className="flex items-center gap-2 justify-center p-2 bg-gray-700/20 rounded-lg">
                        <Clock className="w-3 h-3 text-purple-400" />
                        <span className="font-medium">{produto.tempo_entrega}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
                  </div>
      )}

      {/* Modal de formulário */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="bg-gray-900/95 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-md" onInteractOutside={e => e.preventDefault()}>
            <DialogHeader className="border-b border-gray-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                {editingProduto ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
                  <DialogDescription className="text-gray-400 mt-1">
                {editingProduto ? 'Atualize as informações do produto' : 'Preencha as informações do novo produto'}
              </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              {/* Seção 1: Informações Básicas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <FileText className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-white">Informações Básicas</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Nome do Produto *
                    </Label>
                <Input
                  id="nome"
                  name="nome"
                  defaultValue={editingProduto?.nome}
                  required
                      placeholder="Ex: Smartphone Galaxy S23"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 transition-all"
                />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="codigo" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Código do Produto *
                    </Label>
                <Input
                  id="codigo"
                  name="codigo"
                  defaultValue={editingProduto?.codigo}
                  required
                      placeholder="Ex: PROD-001"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-gray-300 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Descrição
                  </Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  defaultValue={editingProduto?.descricao}
                    placeholder="Descreva as características, benefícios e especificações do produto..."
                    rows={3}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20 transition-all resize-none"
                />
                  </div>
              </div>

              {/* Seção 2: Preços e Custos */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Preços e Custos</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preco" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Preço de Venda *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R$</span>
                  <Input
                    id="preco"
                    name="preco"
                    type="number"
                    step="0.01"
                        min="0"
                    defaultValue={editingProduto?.valor_venda}
                    required
                        placeholder="0,00"
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20 transition-all"
                  />
                  </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="custo" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Custo de Aquisição
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R$</span>
                  <Input
                    id="custo"
                    name="custo"
                    type="number"
                    step="0.01"
                        min="0"
                    defaultValue={editingProduto?.custo}
                        placeholder="0,00"
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 transition-all"
                  />
                  </div>
                  </div>
                </div>
              </div>

              {/* Seção 3: Estoque e Medidas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <Package className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Estoque e Medidas</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estoque" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Estoque Atual *
                    </Label>
                  <Input
                    id="estoque"
                    name="estoque"
                    type="number"
                      min="0"
                    defaultValue={editingProduto?.estoque_atual}
                    required
                      placeholder="0"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                  />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estoque_minimo" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Estoque Mínimo
                    </Label>
                    <Input
                      id="estoque_minimo"
                      name="estoque_minimo"
                      type="number"
                      min="0"
                      defaultValue={editingProduto?.estoque_minimo}
                      placeholder="0"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unidade_medida" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Unidade de Medida
                    </Label>
                  <Select name="unidade_medida" defaultValue={editingProduto?.unidade_medida || 'Unidade'}>
                      <SelectTrigger className="h-9 px-3 py-1.5 bg-gray-800/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all">
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600 max-h-60">
                        <SelectItem value="Unidade" className="text-white hover:bg-gray-700 focus:bg-gray-700">📦 Unidade</SelectItem>
                        <SelectItem value="Kg" className="text-white hover:bg-gray-700 focus:bg-gray-700">⚖️ Quilograma (Kg)</SelectItem>
                        <SelectItem value="g" className="text-white hover:bg-gray-700 focus:bg-gray-700">⚖️ Grama (g)</SelectItem>
                        <SelectItem value="Litro" className="text-white hover:bg-gray-700 focus:bg-gray-700">💧 Litro (L)</SelectItem>
                        <SelectItem value="ml" className="text-white hover:bg-gray-700 focus:bg-gray-700">💧 Mililitro (ml)</SelectItem>
                        <SelectItem value="Metro" className="text-white hover:bg-gray-700 focus:bg-gray-700">📏 Metro (m)</SelectItem>
                        <SelectItem value="cm" className="text-white hover:bg-gray-700 focus:bg-gray-700">📏 Centímetro (cm)</SelectItem>
                        <SelectItem value="Caixa" className="text-white hover:bg-gray-700 focus:bg-gray-700">📦 Caixa</SelectItem>
                        <SelectItem value="Pacote" className="text-white hover:bg-gray-700 focus:bg-gray-700">📦 Pacote</SelectItem>
                        <SelectItem value="Par" className="text-white hover:bg-gray-700 focus:bg-gray-700">👥 Par</SelectItem>
                        <SelectItem value="Conjunto" className="text-white hover:bg-gray-700 focus:bg-gray-700">🎁 Conjunto</SelectItem>
                        <SelectItem value="Rolo" className="text-white hover:bg-gray-700 focus:bg-gray-700">🔄 Rolo</SelectItem>
                        <SelectItem value="Fardo" className="text-white hover:bg-gray-700 focus:bg-gray-700">📦 Fardo</SelectItem>
                        <SelectItem value="Dúzia" className="text-white hover:bg-gray-700 focus:bg-gray-700">12️⃣ Dúzia</SelectItem>
                        <SelectItem value="Quilate" className="text-white hover:bg-gray-700 focus:bg-gray-700">💎 Quilate</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>
                </div>
              </div>

              {/* Seção 4: Categoria e Fornecedor */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <Tag className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Categoria e Fornecedor</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoria" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Categoria
                    </Label>
                    <CategoriaSelect
                      value={editingProduto?.categoria?.id?.toString() || ''}
                      onValueChange={() => {}} // Função vazia pois o componente atualiza automaticamente
                      placeholder="Selecione a categoria"
                      categorias={categoriasProduto}
                      tipo="produto"
                    />
                    {/* Campo hidden para manter compatibilidade com FormData */}
                    <input 
                      type="hidden" 
                      name="categoria"
                      defaultValue={editingProduto?.categoria?.id?.toString() || ''}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fornecedor" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      Fornecedor
                    </Label>
                    <Input
                      id="fornecedor"
                      name="fornecedor"
                      defaultValue={editingProduto?.fornecedor || ''}
                      placeholder="Nome do fornecedor"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 5: Configurações */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <Settings className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Configurações</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Status do Produto
                    </Label>
                    <Select name="status" defaultValue={editingProduto?.status || 'ativo'}>
                      <SelectTrigger className="h-9 px-3 py-1.5 bg-gray-800/50 border-gray-600 text-white focus:border-yellow-500 focus:ring-yellow-500/20 transition-all">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="ativo" className="text-white hover:bg-gray-700 focus:bg-gray-700">✅ Ativo</SelectItem>
                        <SelectItem value="inativo" className="text-white hover:bg-gray-700 focus:bg-gray-700">⏸️ Inativo</SelectItem>
                        <SelectItem value="esgotado" className="text-white hover:bg-gray-700 focus:bg-gray-700">⚠️ Esgotado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tempo_entrega" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                      Tempo de Entrega
                    </Label>
                <Input
                  id="tempo_entrega"
                  name="tempo_entrega"
                  type="text"
                  defaultValue={editingProduto?.tempo_entrega || ''}
                  placeholder="Ex: 2 dias, 5 dias úteis, imediato"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all"
                />
                    </div>
                    </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <input 
                    type="checkbox"
                    id="destaque" 
                    name="destaque"
                    defaultChecked={editingProduto?.destaque}
                    className="w-5 h-5 text-orange-600 bg-gray-800 border-gray-600 rounded focus:ring-orange-500 focus:ring-2 transition-all"
                  />
                  <Label htmlFor="destaque" className="text-gray-300 font-medium flex items-center gap-2 cursor-pointer">
                    <Star className="w-4 h-4 text-orange-400" />
                    Produto em Destaque
                  </Label>
                  <span className="text-xs text-gray-500 ml-auto">Produtos em destaque aparecem com prioridade</span>
                    </div>
                  </div>

              {/* Footer com Botões */}
              <DialogFooter className="border-t border-gray-700 pt-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel} 
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all flex-1 sm:flex-none"
                  >
                    <X className="w-4 h-4 mr-2" />
                  Cancelar
          </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white transition-all flex-1 sm:flex-none"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {editingProduto ? 'Atualizar Produto' : 'Cadastrar Produto'}
              </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Função utilitária para pluralizar unidade
function pluralizarUnidade(unidade, quantidade) {
  if (!unidade) return '';
  const plurais = {
    'Unidade': quantidade === 1 ? 'unidade' : 'unidades',
    'Kg': 'Kg',
    'g': 'g',
    'Litro': quantidade === 1 ? 'litro' : 'litros',
    'ml': 'ml',
    'Metro': quantidade === 1 ? 'metro' : 'metros',
    'cm': quantidade === 1 ? 'centímetro' : 'centímetros',
    'Caixa': quantidade === 1 ? 'caixa' : 'caixas',
    'Pacote': quantidade === 1 ? 'pacote' : 'pacotes',
    'Par': quantidade === 1 ? 'par' : 'pares',
    'Conjunto': quantidade === 1 ? 'conjunto' : 'conjuntos',
    'Rolo': quantidade === 1 ? 'rolo' : 'rolos',
    'Fardo': quantidade === 1 ? 'fardo' : 'fardos',
    'Dúzia': quantidade === 1 ? 'dúzia' : 'dúzias',
    'Quilate': quantidade === 1 ? 'quilate' : 'quilates',
    'Outros': quantidade === 1 ? 'item' : 'itens',
  };
  return plurais[unidade] || unidade + (quantidade === 1 ? '' : 's');
}

// Componente de Serviços
function Servicos() {
  const [servicos, setServicos] = useState([])
  const [categoriasProduto, setCategoriasProduto] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingServico, setEditingServico] = useState(null)

  useEffect(() => {
    carregarServicos()
    carregarCategorias()
  }, [])

  const carregarServicos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/produtos?tipo=servico')
      if (!response.ok) {
        throw new Error('Erro ao carregar serviços')
      }
      const data = await response.json()
      setServicos(data.produtos || [])
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
      setServicos([])
    } finally {
      setLoading(false)
    }
  }

  const carregarCategorias = async () => {
    try {
      const response = await fetch('/api/categorias-produto')
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias')
      }
      const data = await response.json()
      // Filtrar apenas categorias de serviços (IDs 37-66)
      const categoriasFiltradas = data.filter(cat => cat.id >= 37 && cat.id <= 66)
      setCategoriasProduto(categoriasFiltradas)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      setCategoriasProduto([])
    }
  }

  const servicosFiltrados = servicos.filter(servico =>
    servico.nome.toLowerCase().includes(busca.toLowerCase()) ||
    servico.codigo.toLowerCase().includes(busca.toLowerCase())
  )

  const totalServicos = servicos.length
  const servicosAtivos = servicos.filter(s => s.status === 'ativo').length
  const valorTotal = servicos.reduce((acc, s) => acc + s.valor_venda, 0)
  const categorias = [...new Set(servicos.map(s => s.categoria?.nome))].length

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    // Obter o ID da categoria selecionada
    const categoriaSelecionada = formData.get('categoria')
    let categoria_id = null
    if (categoriaSelecionada && categoriaSelecionada !== '') {
      categoria_id = parseInt(categoriaSelecionada)
    }
    
    const servicoData = {
      nome: formData.get('nome'),
      codigo: formData.get('codigo'),
      descricao: formData.get('descricao'),
      valor_venda: parseFloat(formData.get('preco')),
      custo: parseFloat(formData.get('custo') || 0),
      fornecedor: formData.get('fornecedor'),
      tempo_entrega: formData.get('duracao'),
      estoque_atual: 0,
      estoque_minimo: 0,
      status: formData.get('status'),
      destaque: formData.get('destaque') === 'on',
      categoria_id: categoria_id,
      tipo: 'servico'
    }

    try {
      const url = editingServico 
        ? `/api/produtos/${editingServico.id}` 
        : '/api/produtos'
      
      const method = editingServico ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicoData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.erro || 'Erro ao salvar serviço')
      }

      await carregarServicos()
      setShowForm(false)
      setEditingServico(null)
    } catch (error) {
      console.error('Erro ao salvar serviço:', error)
      alert(`Erro: ${error.message}`)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingServico(null)
  }

  const deletarServico = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este serviço?')) return
    
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.erro || 'Erro ao deletar serviço')
      }
      
      await carregarServicos()
    } catch (error) {
      console.error('Erro ao deletar serviço:', error)
      alert(`Erro: ${error.message}`)
    }
  }

  const abrirFormularioNovo = () => {
    setEditingServico(null)
    setShowForm(true)
  }

  const abrirFormularioEdicao = (servico) => {
    setEditingServico(servico)
    setShowForm(true)
  }

  const criarCategoriasPadrao = async () => {
    try {
      const response = await fetch('/api/categorias-produto/criar-padrao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.erro || 'Erro ao criar categorias padrão')
      }
      
      const result = await response.json()
      alert(`✅ ${result.mensagem}\n\n📊 Categorias criadas: ${result.categorias_criadas}\n📊 Categorias existentes: ${result.categorias_existentes}\n📊 Total: ${result.total_categorias}`)
      
      // Recarregar categorias após criar
      await carregarCategorias()
    } catch (error) {
      console.error('Erro ao criar categorias padrão:', error)
      alert(`Erro: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8 w-full flex flex-col items-center sm:items-start">
          <div className="flex flex-col items-center gap-3 mb-2 sm:flex-row sm:items-center w-full">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg header-icon-circle">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight w-full text-center sm:text-left">
              Serviços
            </h1>
          </div>
          <p className="text-gray-400 text-lg w-full text-center sm:text-left">Gerencie seus serviços oferecidos</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 animate-pulse col-span-3">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 flex items-center justify-center mb-4 animate-spin">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div className="text-white text-lg">Carregando serviços...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 w-full flex flex-col items-center sm:items-start">
        <div className="flex flex-col items-center gap-3 mb-2 sm:flex-row sm:items-center w-full">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg header-icon-circle">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight w-full text-center sm:text-left">
            Serviços
          </h1>
        </div>
        <p className="text-gray-400 text-lg w-full text-center sm:text-left">Gerencie seus serviços oferecidos</p>
            </div>
            
      {/* Barra de busca e botão adicionar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
              type="text"
              placeholder="Buscar serviços..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
          </div>
        <Button onClick={abrirFormularioNovo} className="bg-purple-600 hover:bg-purple-700 text-white px-6">
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
          </div>
          
      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-purple-300">Total de Serviços</p>
                <p className="text-2xl font-bold text-purple-400">{servicos.length}</p>
            </div>
              <Wrench className="w-8 h-8 text-purple-400" />
          </div>
          </CardContent>
        </Card>
            
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-blue-300">Valor Total</p>
                <p className="text-2xl font-bold text-blue-400">
                  R$ {servicos.reduce((acc, s) => acc + s.valor_venda, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
            </div>
              <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
          </CardContent>
        </Card>
              
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 hover:border-green-500/40 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300">Ativos</p>
                <p className="text-2xl font-bold text-green-400">
                  {servicos.filter(s => s.status === 'ativo').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
              
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-300">Categorias</p>
                <p className="text-2xl font-bold text-orange-400">
                  {new Set(servicos.map(s => s.categoria?.nome || s.categoria).filter(Boolean)).size}
                </p>
              </div>
              <Tag className="w-8 h-8 text-orange-400" />
              </div>
          </CardContent>
        </Card>
            </div>
            
      {/* Lista de serviços */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {servicosFiltrados.length === 0 ? (
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 col-span-3">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wrench className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                {busca ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
              </h3>
              <p className="text-gray-400 mb-6">
                {busca
                  ? `Nenhum serviço encontrado para "${busca}". Tente uma busca diferente.`
                  : 'Comece adicionando seu primeiro serviço'}
              </p>
              {!busca && (
                <Button
                  onClick={abrirFormularioNovo}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Serviço
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          servicosFiltrados.map((servico) => (
            <Card key={servico.id} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => abrirFormularioEdicao(servico)}
                      className="text-gray-400 hover:text-white hover:bg-gray-700/50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                  <div className="flex-1 text-center min-w-0">
                    <CardTitle className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors truncate">{servico.nome}</CardTitle>
                    <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors text-sm font-mono">{servico.codigo}</CardDescription>
                </div>
                  <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deletarServico(servico.id)}
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
                  {/* Status */}
                {servico.status && (
                  <Badge className={`${
                      servico.status === 'ativo' ? 'bg-green-500/20 text-green-300 border-green-500/30 shadow-lg shadow-green-500/20' :
                    servico.status === 'inativo' ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' :
                    'bg-gray-500/20 text-gray-300 border-gray-500/30'
                    } font-medium`}>
                    {servico.status === 'ativo' ? '✓ Ativo' : 
                     servico.status === 'inativo' ? '○ Inativo' : servico.status}
                  </Badge>
                )}
                {/* Categoria */}
                {servico.categoria && (
                  <Badge 
                    className="border-purple-500/30 font-medium shadow-lg"
                    style={{ 
                      backgroundColor: `${servico.categoria.cor}20`, 
                      color: servico.categoria.cor,
                      borderColor: `${servico.categoria.cor}30`,
                      boxShadow: `${servico.categoria.cor}20 0 4px 12px`
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: servico.categoria.cor }}
                      ></div>
                      {servico.categoria.nome || servico.categoria}
                    </div>
                  </Badge>
                )}
                {/* Destaque */}
                {servico.destaque && (
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 font-medium shadow-lg shadow-yellow-500/20">
                    ⭐ Destaque
                  </Badge>
                )}
              </div>
              
              {/* Preço Principal - Destaque */}
              <div className="text-center p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/5 rounded-lg border border-purple-500/20">
                <p className="text-xs text-gray-400 mb-1 font-medium">Preço do Serviço</p>
                <p className="text-2xl font-bold text-purple-400">
                  R$ {servico.valor_venda?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              {/* Grid de Informações Principais */}
              <div className="grid grid-cols-2 gap-3">
                {/* Duração */}
                <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/30 text-center">
                  <p className="text-xs text-gray-400 mb-1">Duração</p>
                  <p className="text-lg font-bold text-blue-400">
                    {servico.tempo_entrega || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">tempo estimado</p>
                </div>
                
                {/* Margem de Lucro */}
                <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/30 text-center">
                  <p className="text-xs text-gray-400 mb-1">Margem</p>
                  <p className={`text-lg font-bold ${servico.margem_lucro > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {servico.margem_lucro?.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">de lucro</p>
                </div>
              </div>
              
              {/* Informações Financeiras Detalhadas */}
              {(servico.custo || servico.lucro_unitario) && (
                <div className="space-y-2 p-3 bg-gray-700/10 rounded-lg border border-gray-700/20">
                  {servico.custo && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Custo
                      </span>
                      <span className="text-red-400 font-medium">R$ {servico.custo?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {servico.lucro_unitario && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Lucro Unit.
                      </span>
                      <span className="text-green-400 font-medium">R$ {servico.lucro_unitario?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Descrição */}
              {servico.descricao && (
                <div className="p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{servico.descricao}</p>
                </div>
              )}
              
              {/* Informações Adicionais */}
              {servico.fornecedor && (
                <div className="text-xs text-gray-400 space-y-2 pt-3 border-t border-gray-700/50">
                  <div className="flex items-center gap-2 justify-center p-2 bg-gray-700/20 rounded-lg">
                    <Wrench className="w-3 h-3 text-purple-400" />
                    <span className="font-medium">{servico.fornecedor}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
        )}
          </div>
          
      {/* Modal de formulário */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="bg-gray-900/95 border-gray-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-md" onInteractOutside={e => e.preventDefault()}>
            <DialogHeader className="border-b border-gray-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-white">
                {editingServico ? 'Editar Serviço' : 'Novo Serviço'}
              </DialogTitle>
                  <DialogDescription className="text-gray-400 mt-1">
                {editingServico ? 'Atualize as informações do serviço' : 'Preencha as informações do novo serviço'}
              </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              {/* Seção 1: Informações Básicas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <FileText className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-white">Informações Básicas</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Nome do Serviço *
                    </Label>
              <Input
                  id="nome"
                  name="nome"
                  defaultValue={editingServico?.nome}
                  required
                      placeholder="Ex: Manutenção de Computadores"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
              />
            </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="codigo" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Código do Serviço *
                    </Label>
              <Input
                  id="codigo"
                  name="codigo"
                  defaultValue={editingServico?.codigo}
                  required
                      placeholder="Ex: SER-001"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
              />
            </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-gray-300 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Descrição
                  </Label>
            <Textarea
                  id="descricao"
                  name="descricao"
                  defaultValue={editingServico?.descricao}
                    placeholder="Descreva as características, benefícios e especificações do serviço..."
                    rows={3}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20 transition-all resize-none"
            />
          </div>
              </div>

              {/* Seção 2: Preços e Custos */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Preços e Custos</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preco" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Preço do Serviço *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R$</span>
                  <Input
                    id="preco"
                    name="preco"
                    type="number"
                    step="0.01"
                        min="0"
                    defaultValue={editingServico?.valor_venda}
                    required
                        placeholder="0,00"
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20 transition-all"
                  />
            </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="custo" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Custo de Execução
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R$</span>
                  <Input
                    id="custo"
                    name="custo"
                    type="number"
                    step="0.01"
                        min="0"
                    defaultValue={editingServico?.custo}
                        placeholder="0,00"
                        className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 transition-all"
                  />
            </div>
          </div>
            </div>
            </div>

              {/* Seção 3: Categoria e Fornecedor */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <Tag className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Categoria e Fornecedor</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoria" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Categoria
                    </Label>
                    <CategoriaSelect
                      value={editingServico?.categoria?.id?.toString() || ''}
                      onValueChange={() => {}} // Função vazia pois o componente atualiza automaticamente
                      placeholder="Selecione a categoria"
                      categorias={categoriasProduto}
                      tipo="servico"
                    />
                    {/* Campo hidden para manter compatibilidade com FormData */}
                    <input 
                      type="hidden" 
                      name="categoria"
                      defaultValue={editingServico?.categoria?.id?.toString() || ''}
                  />
            </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fornecedor" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                      Fornecedor
                    </Label>
                  <Input
                    id="fornecedor"
                    name="fornecedor"
                      defaultValue={editingServico?.fornecedor || ''}
                      placeholder="Nome do fornecedor"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                  />
            </div>
          </div>
                          </div>

              {/* Seção 4: Configurações */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-700">
                  <Settings className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Configurações</h3>
              </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Status do Serviço
                    </Label>
                    <Select name="status" defaultValue={editingServico?.status || 'ativo'}>
                      <SelectTrigger className="h-9 px-3 py-1.5 bg-gray-800/50 border-gray-600 text-white focus:border-yellow-500 focus:ring-yellow-500/20 transition-all">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="ativo" className="text-white hover:bg-gray-700 focus:bg-gray-700">✅ Ativo</SelectItem>
                        <SelectItem value="inativo" className="text-white hover:bg-gray-700 focus:bg-gray-700">⏸️ Inativo</SelectItem>
                        <SelectItem value="encerrado" className="text-white hover:bg-gray-700 focus:bg-gray-700">⚠️ Encerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duracao" className="text-gray-300 font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                      Duração
                    </Label>
                    <Input
                      id="duracao"
                      name="duracao"
                      defaultValue={editingServico?.tempo_entrega}
                      placeholder="Ex: 2 horas"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 transition-all"
                />
              </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <input 
                    type="checkbox"
                    id="destaque" 
                    name="destaque"
                    defaultChecked={editingServico?.destaque}
                    className="w-5 h-5 text-orange-600 bg-gray-800 border-gray-600 rounded focus:ring-orange-500 focus:ring-2 transition-all"
                  />
                  <Label htmlFor="destaque" className="text-gray-300 font-medium flex items-center gap-2 cursor-pointer">
                    <Star className="w-4 h-4 text-orange-400" />
                    Serviço em Destaque
                  </Label>
                  <span className="text-xs text-gray-500 ml-auto">Serviços em destaque aparecem com prioridade</span>
                </div>
              </div>

              {/* Footer com Botões */}
              <DialogFooter className="border-t border-gray-700 pt-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel} 
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all flex-1 sm:flex-none"
                  >
                    <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all flex-1 sm:flex-none"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {editingServico ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
            </Button>
                </div>
              </DialogFooter>
        </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Componente de Select de Categoria Melhorado
function CategoriaSelect({ 
  value, 
  onValueChange, 
  placeholder = "Selecione a categoria", 
  categorias, 
  tipo = "produto" 
}) {
  const [busca, setBusca] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  
  // Filtrar categorias baseado na busca
  const categoriasFiltradas = categorias.filter(cat => 
    cat.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cat.descricao?.toLowerCase().includes(busca.toLowerCase())
  )
  
  // Agrupar categorias por tipo
  const categoriasProdutos = categoriasFiltradas.filter(cat => cat.id <= 36)
  const categoriasServicos = categoriasFiltradas.filter(cat => cat.id > 36)
  
  // Encontrar categoria selecionada
  const categoriaSelecionada = categorias.find(cat => cat.id.toString() === value)
  
  // Função para atualizar o valor no formulário
  const atualizarValorFormulario = (novoValor) => {
    onValueChange(novoValor)
    
    // Atualizar o campo hidden do formulário
    const form = document.querySelector('form')
    if (form) {
      const categoriaInput = form.querySelector('input[name="categoria"]')
      if (categoriaInput) {
        categoriaInput.value = novoValor
      }
    }
  }
  
  return (
    <div className="relative">
      <div 
        className="flex items-center justify-between w-full px-3 py-1.5 h-9 bg-gray-800 border border-gray-700 rounded-md text-white cursor-pointer hover:border-gray-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {categoriaSelecionada ? (
            <>
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: categoriaSelecionada.cor }}
              />
              <span className="truncate">{categoriaSelecionada.nome}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-80 overflow-hidden">
          {/* Campo de busca */}
          <div className="p-2 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar categoria..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>
          </div>
          
          {/* Lista de categorias */}
          <div className="max-h-64 overflow-y-auto">
            {categoriasFiltradas.length === 0 ? (
              <div className="p-3 text-center text-gray-400">
                Nenhuma categoria encontrada
              </div>
            ) : (
              <>
                {/* Categorias de Produtos */}
                {categoriasProdutos.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 bg-gray-700/50 border-b border-gray-600">
                      📦 PRODUTOS
                    </div>
                    {categoriasProdutos.map(cat => (
                      <div
                        key={cat.id}
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-700 transition-colors ${
                          value === cat.id.toString() ? 'bg-blue-600/20 border-r-2 border-blue-500' : ''
                        }`}
                        onClick={() => {
                          atualizarValorFormulario(cat.id.toString())
                          setIsOpen(false)
                          setBusca('')
                        }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: cat.cor }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate">{cat.nome}</div>
                          {cat.descricao && (
                            <div className="text-xs text-gray-400 truncate">{cat.descricao}</div>
                          )}
                        </div>
                        {value === cat.id.toString() && (
                          <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Categorias de Serviços */}
                {categoriasServicos.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 bg-gray-700/50 border-b border-gray-600">
                      🔧 SERVIÇOS
                    </div>
                    {categoriasServicos.map(cat => (
                      <div
                        key={cat.id}
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-700 transition-colors ${
                          value === cat.id.toString() ? 'bg-purple-600/20 border-r-2 border-purple-500' : ''
                        }`}
                        onClick={() => {
                          atualizarValorFormulario(cat.id.toString())
                          setIsOpen(false)
                          setBusca('')
                        }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: cat.cor }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate">{cat.nome}</div>
                          {cat.descricao && (
                            <div className="text-xs text-gray-400 truncate">{cat.descricao}</div>
                          )}
                        </div>
                        {value === cat.id.toString() && (
                          <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Overlay para fechar ao clicar fora */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsOpen(false)
            setBusca('')
          }}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="w-screen max-w-full overflow-x-hidden min-h-screen bg-gray-900">
        <div className="px-2 md:px-4">
        <div className="flex">
        <Navigation />
            <main className="flex-1 md:ml-64">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clientes" element={<ClientesList />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/agendamentos" element={<Agendamentos />} />
              <Route path="/lembretes" element={<Lembretes />} />
              <Route path="/relatorios" element={<Relatorios />} />
            </Routes>
        </main>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App






