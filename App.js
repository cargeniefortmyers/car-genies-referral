import React, { useState, useRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Stable Input Component defined outside main component to prevent recreation
const StableTextInput = React.memo(({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false, 
  keyboardType = 'default',
  error,
  autoCapitalize = 'sentences',
  editable = true,
  multiline = false,
  numberOfLines = 1,
  inputRef
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          multiline && styles.textArea,
          error && styles.inputError,
          !editable && styles.inputDisabled
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
        blurOnSubmit={false}
        autoCorrect={false}
        spellCheck={false}
        autoComplete="off"
        textContentType="none"
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
});

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // User settings
  const [userSettings, setUserSettings] = useState({
    payoutMethod: 'paypal',
    paypalEmail: '',
    cashappTag: '',
    notifications: true,
    autoPayouts: false,
    minimumPayout: 100,
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Login form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register form
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // Referral form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('sedan');
  const [budget, setBudget] = useState('20k-40k');
  const [notes, setNotes] = useState('');
  
  // Data
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalEarnings: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    currentTier: 1
  });

  // API Base URL - YOUR BACKEND SERVER
  const API_BASE_URL = 'https://0cda24f3-67e9-4f97-929e-3939ce9dd8bb-00-ebf7j6lljemp.kirk.replit.dev';

  // Translation function
  const translations = {
    en: {
      welcome: 'Welcome',
      login: 'Login',
      register: 'Register',
      username: 'Username',
      password: 'Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      confirmPassword: 'Confirm Password',
      dashboard: 'Dashboard',
      addReferral: 'Add Referral',
      history: 'History',
      settings: 'Settings',
      signOut: 'Sign Out',
      customerName: 'Customer Name',
      customerEmail: 'Customer Email',
      customerPhone: 'Customer Phone',
      vehicleType: 'Vehicle Type',
      budget: 'Budget Range',
      notes: 'Notes',
      submit: 'Submit',
      totalReferrals: 'Total Referrals',
      totalEarnings: 'Total Earnings',
      pendingReferrals: 'Pending',
      completedReferrals: 'Completed',
      currentTier: 'Current Tier',
      commission: 'Commission',
      status: 'Status',
      date: 'Date',
      invalidCredentials: 'Invalid username or password',
      sedan: 'Sedan',
      suv: 'SUV',
      truck: 'Truck',
      coupe: 'Coupe',
      convertible: 'Convertible',
      hatchback: 'Hatchback',
      pending: 'Pending',
      approved: 'Approved',
      completed: 'Completed',
      rejected: 'Rejected'
    },
    es: {
      welcome: 'Bienvenido',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      username: 'Usuario',
      password: 'Contraseña',
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo',
      confirmPassword: 'Confirmar Contraseña',
      dashboard: 'Panel',
      addReferral: 'Agregar Referido',
      history: 'Historial',
      settings: 'Configuración',
      signOut: 'Cerrar Sesión',
      customerName: 'Nombre del Cliente',
      customerEmail: 'Correo del Cliente',
      customerPhone: 'Teléfono del Cliente',
      vehicleType: 'Tipo de Vehículo',
      budget: 'Rango de Presupuesto',
      notes: 'Notas',
      submit: 'Enviar',
      totalReferrals: 'Total de Referidos',
      totalEarnings: 'Ganancias Totales',
      pendingReferrals: 'Pendientes',
      completedReferrals: 'Completados',
      currentTier: 'Nivel Actual',
      commission: 'Comisión',
      status: 'Estado',
      date: 'Fecha',
      invalidCredentials: 'Usuario o contraseña inválidos',
      sedan: 'Sedán',
      suv: 'SUV',
      truck: 'Camioneta',
      coupe: 'Cupé',
      convertible: 'Convertible',
      hatchback: 'Hatchback',
      pending: 'Pendiente',
      approved: 'Aprobado',
      completed: 'Completado',
      rejected: 'Rechazado'
    },
    fr: {
      welcome: 'Bienvenue',
      login: 'Connexion',
      register: 'S\'inscrire',
      username: 'Nom d\'utilisateur',
      password: 'Mot de passe',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      confirmPassword: 'Confirmer le mot de passe',
      dashboard: 'Tableau de bord',
      addReferral: 'Ajouter une référence',
      history: 'Historique',
      settings: 'Paramètres',
      signOut: 'Se déconnecter',
      customerName: 'Nom du client',
      customerEmail: 'Email du client',
      customerPhone: 'Téléphone du client',
      vehicleType: 'Type de véhicule',
      budget: 'Gamme de budget',
      notes: 'Notes',
      submit: 'Soumettre',
      totalReferrals: 'Total des références',
      totalEarnings: 'Gains totaux',
      pendingReferrals: 'En attente',
      completedReferrals: 'Terminées',
      currentTier: 'Niveau actuel',
      commission: 'Commission',
      status: 'Statut',
      date: 'Date',
      invalidCredentials: 'Nom d\'utilisateur ou mot de passe invalide',
      sedan: 'Berline',
      suv: 'SUV',
      truck: 'Camion',
      coupe: 'Coupé',
      convertible: 'Cabriolet',
      hatchback: 'Hayon',
      pending: 'En attente',
      approved: 'Approuvé',
      completed: 'Terminé',
      rejected: 'Rejeté'
    },
    ht: {
      welcome: 'Byenvini',
      login: 'Konekte',
      register: 'Enskri',
      username: 'Non itilizatè',
      password: 'Modpas',
      firstName: 'Premye Non',
      lastName: 'Dezyèm Non',
      email: 'Imèl',
      confirmPassword: 'Konfime Modpas',
      dashboard: 'Tablo Kòmand',
      addReferral: 'Ajoute Referans',
      history: 'Istwa',
      settings: 'Paramèt',
      signOut: 'Dekonekte',
      customerName: 'Non Kliyèn',
      customerEmail: 'Imèl Kliyèn',
      customerPhone: 'Telefòn Kliyèn',
      vehicleType: 'Kalite Machin',
      budget: 'Bidjè',
      notes: 'Nòt',
      submit: 'Voye',
      totalReferrals: 'Total Referans',
      totalEarnings: 'Total Benefis',
      pendingReferrals: 'K ap tann',
      completedReferrals: 'Fini',
      currentTier: 'Nivo Kounye a',
      commission: 'Komisyon',
      status: 'Eta',
      date: 'Dat',
      invalidCredentials: 'Non itilizatè oswa modpas ki pa bon',
      sedan: 'Sedan',
      suv: 'SUV',
      truck: 'Kamyon',
      coupe: 'Coupe',
      convertible: 'Convertible',
      hatchback: 'Hatchback',
      pending: 'K ap tann',
      approved: 'Apwouve',
      completed: 'Fini',
      rejected: 'Rejte'
    }
  };

  const t = (key) => translations[language][key] || key;

  // Validation functions
  const validateLogin = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!regUsername.trim()) newErrors.regUsername = 'Username is required';
    if (!regPassword) newErrors.regPassword = 'Password is required';
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    if (regPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (email && !email.includes('@')) newErrors.email = 'Invalid email format';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateReferral = () => {
    const newErrors = {};
    if (!customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!customerEmail.trim()) newErrors.customerEmail = 'Customer email is required';
    if (!customerPhone.trim()) newErrors.customerPhone = 'Customer phone is required';
    if (customerEmail && !customerEmail.includes('@')) newErrors.customerEmail = 'Invalid email format';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API Functions
  const handleLogin = async () => {
    setErrors({});
    
    if (!validateLogin()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setCurrentScreen('dashboard');
        Alert.alert('Success', `${t('welcome')}, ${data.user.firstName}!`);
        // Load user's referral data
        await loadUserData();
      } else {
        setErrors({ general: data.message || t('invalidCredentials') });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    }
    
    setLoading(false);
  };

  const handleRegister = async () => {
    setErrors({});
    
    if (!validateRegister()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: regUsername.trim(),
          password: regPassword,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!');
        setUser(data.user);
        setCurrentScreen('dashboard');
        clearRegisterForm();
        // Load user's referral data
        await loadUserData();
      } else {
        if (data.message.includes('Username')) {
          setErrors({ regUsername: data.message });
        } else if (data.message.includes('Email')) {
          setErrors({ email: data.message });
        } else {
          setErrors({ general: data.message });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    }
    
    setLoading(false);
  };

  const submitReferral = async () => {
    setErrors({});
    
    if (!validateReferral()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/referrals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: customerName.split(' ')[0] || customerName,
          lastName: customerName.split(' ').slice(1).join(' ') || '',
          email: customerEmail.trim(),
          phone: customerPhone.trim(),
          vehicleType,
          budget,
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Referral submitted successfully!');
        clearReferralForm();
        setCurrentScreen('dashboard');
        await loadUserData(); // Reload data
      } else {
        setErrors({ general: data.message || 'Failed to submit referral' });
      }
    } catch (error) {
      console.error('Referral submission error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    }
    
    setLoading(false);
  };

  // Form clearing functions
  const clearLoginForm = () => {
    setUsername('');
    setPassword('');
    setErrors({});
  };

  const clearRegisterForm = () => {
    setRegUsername('');
    setRegPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setErrors({});
  };

  const clearReferralForm = () => {
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setVehicleType('sedan');
    setBudget('20k-40k');
    setNotes('');
    setErrors({});
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/logout`, { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API response
      setUser(null);
      setCurrentScreen('login');
      setUsername('');
      setPassword('');
      setReferrals([]);
      setStats({ totalReferrals: 0, totalEarnings: 0, pendingReferrals: 0, completedReferrals: 0, currentTier: 1 });
    }
  };

  const loadUserData = async () => {
    try {
      // Initialize with clean slate
      setReferrals([]);
      setStats({ totalReferrals: 0, totalEarnings: 0, pendingReferrals: 0, completedReferrals: 0, currentTier: 1 });
      
      // Load user's actual referrals
      const referralsResponse = await fetch(`${API_BASE_URL}/api/referrals`);
      if (referralsResponse.ok) {
        const referralsData = await referralsResponse.json();
        setReferrals(referralsData || []);
      } else {
        // If user has no referrals, keep empty array
        setReferrals([]);
      }
      
      // Load user's actual stats
      const statsResponse = await fetch(`${API_BASE_URL}/api/referrals/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData || { totalReferrals: 0, totalEarnings: 0, pendingReferrals: 0, completedReferrals: 0, currentTier: 1 });
      } else {
        // If user has no stats, keep zeros
        setStats({ totalReferrals: 0, totalEarnings: 0, pendingReferrals: 0, completedReferrals: 0, currentTier: 1 });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // On error, ensure clean slate
      setReferrals([]);
      setStats({ totalReferrals: 0, totalEarnings: 0, pendingReferrals: 0, completedReferrals: 0, currentTier: 1 });
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/referrals/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await loadUserData(); // Reload data
      } else {
        Alert.alert('Error', 'Failed to update referral status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  // Component render functions
  const renderLogin = () => (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Car Genies</Text>
          <Text style={styles.subtitle}>Referral Program</Text>
        </View>

        {errors.general && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.general}</Text>
          </View>
        )}

        <View style={styles.form}>
          <StableTextInput
            label={t('username')}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            autoCapitalize="none"
            error={errors.username}
          />
          
          <StableTextInput
            label={t('password')}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : t('login')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => setCurrentScreen('register')}
          >
            <Text style={styles.linkText}>Don't have an account? {t('register')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.languageSelector}>
          <Text style={styles.languageLabel}>Language:</Text>
          <View style={styles.languageButtons}>
            {[
              { code: 'en', label: 'EN' },
              { code: 'es', label: 'ES' },
              { code: 'fr', label: 'FR' },
              { code: 'ht', label: 'HT' }
            ].map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageButton,
                  language === lang.code && styles.languageButtonActive
                ]}
                onPress={() => setLanguage(lang.code)}
              >
                <Text style={[
                  styles.languageButtonText,
                  language === lang.code && styles.languageButtonTextActive
                ]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderRegister = () => (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Car Genies Referral Program</Text>
        </View>

        {errors.general && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.general}</Text>
          </View>
        )}

        <View style={styles.form}>
          <StableTextInput
            label={t('username')}
            value={regUsername}
            onChangeText={setRegUsername}
            placeholder="Choose username"
            autoCapitalize="none"
            error={errors.regUsername}
          />
          
          <StableTextInput
            label={t('email')}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          
          <StableTextInput
            label={t('firstName')}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
            error={errors.firstName}
          />
          
          <StableTextInput
            label={t('lastName')}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
            error={errors.lastName}
          />
          
          <StableTextInput
            label={t('password')}
            value={regPassword}
            onChangeText={setRegPassword}
            placeholder="Create password"
            secureTextEntry
            autoCapitalize="none"
            error={errors.regPassword}
          />
          
          <StableTextInput
            label={t('confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry
            autoCapitalize="none"
            error={errors.confirmPassword}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : t('register')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => setCurrentScreen('login')}
          >
            <Text style={styles.linkText}>Already have an account? {t('login')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderDashboard = () => (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome, {user?.firstName}!</Text>
          <Text style={styles.subtitle}>Referral Dashboard</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>{stats.totalReferrals}</Text>
            <Text style={styles.statsLabel}>{t('totalReferrals')}</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>${stats.totalEarnings}</Text>
            <Text style={styles.statsLabel}>{t('totalEarnings')}</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>{stats.pendingReferrals}</Text>
            <Text style={styles.statsLabel}>{t('pendingReferrals')}</Text>
          </View>
          
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>Tier {stats.currentTier}</Text>
            <Text style={styles.statsLabel}>{t('currentTier')}</Text>
          </View>
        </View>

        {/* Commission Tiers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Commission Tiers</Text>
          <View style={styles.tierContainer}>
            <View style={[styles.tierCard, stats.currentTier >= 1 && styles.tierCardActive]}>
              <Text style={styles.tierTitle}>Tier 1</Text>
              <Text style={styles.tierCommission}>$300</Text>
              <Text style={styles.tierRange}>Referrals 1-10</Text>
            </View>
            
            <View style={[styles.tierCard, stats.currentTier >= 2 && styles.tierCardActive]}>
              <Text style={styles.tierTitle}>Tier 2</Text>
              <Text style={styles.tierCommission}>$400</Text>
              <Text style={styles.tierRange}>Referrals 11-20</Text>
            </View>
            
            <View style={[styles.tierCard, stats.currentTier >= 3 && styles.tierCardActive]}>
              <Text style={styles.tierTitle}>Tier 3</Text>
              <Text style={styles.tierCommission}>$500</Text>
              <Text style={styles.tierRange}>Referrals 21+</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.signOutButton} 
          onPress={handleLogout}
        >
          <Text style={styles.signOutText}>{t('signOut')}</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <BottomNav />
      <SettingsModal />
    </View>
  );

  const renderAddReferral = () => (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>{t('addReferral')}</Text>
          <Text style={styles.subtitle}>Submit a new customer referral</Text>
        </View>

        {errors.general && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.general}</Text>
          </View>
        )}

        <View style={styles.form}>
          <StableTextInput
            label={t('customerName')}
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Full name"
            error={errors.customerName}
          />
          
          <StableTextInput
            label={t('customerEmail')}
            value={customerEmail}
            onChangeText={setCustomerEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.customerEmail}
          />
          
          <StableTextInput
            label={t('customerPhone')}
            value={customerPhone}
            onChangeText={setCustomerPhone}
            placeholder="(555) 123-4567"
            keyboardType="phone-pad"
            error={errors.customerPhone}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('vehicleType')}</Text>
            <View style={styles.pickerContainer}>
              {['sedan', 'suv', 'truck', 'coupe', 'convertible', 'hatchback'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pickerOption,
                    vehicleType === type && styles.pickerOptionActive
                  ]}
                  onPress={() => setVehicleType(type)}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    vehicleType === type && styles.pickerOptionTextActive
                  ]}>
                    {t(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('budget')}</Text>
            <View style={styles.pickerContainer}>
              {['Under 20k', '20k-40k', '40k-60k', '60k-80k', '80k+'].map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[
                    styles.pickerOption,
                    budget === range && styles.pickerOptionActive
                  ]}
                  onPress={() => setBudget(range)}
                >
                  <Text style={[
                    styles.pickerOptionText,
                    budget === range && styles.pickerOptionTextActive
                  ]}>
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <StableTextInput
            label={t('notes')}
            value={notes}
            onChangeText={setNotes}
            placeholder="Additional notes (optional)"
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={submitReferral}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Submitting...' : t('submit')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <BottomNav />
      <SettingsModal />
    </KeyboardAvoidingView>
  );

  const renderHistory = () => (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('history')}</Text>
          <Text style={styles.subtitle}>Your referral history</Text>
        </View>

        {referrals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No referrals yet</Text>
            <Text style={styles.emptyStateSubtext}>Submit your first referral to get started!</Text>
          </View>
        ) : (
          <View style={styles.referralsList}>
            {referrals.map((referral) => (
              <View key={referral.id} style={styles.referralCard}>
                <View style={styles.referralHeader}>
                  <Text style={styles.referralName}>
                    {referral.firstName} {referral.lastName}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    referral.status === 'completed' && styles.statusCompleted,
                    referral.status === 'approved' && styles.statusApproved,
                    referral.status === 'pending' && styles.statusPending,
                    referral.status === 'rejected' && styles.statusRejected
                  ]}>
                    <Text style={styles.statusText}>{t(referral.status)}</Text>
                  </View>
                </View>
                
                <Text style={styles.referralDetails}>
                  {referral.email} • {referral.phone}
                </Text>
                
                <Text style={styles.referralDetails}>
                  {t(referral.vehicleType)} • {referral.budget}
                </Text>
                
                {referral.commission && (
                  <Text style={styles.referralCommission}>
                    Commission: ${referral.commission}
                  </Text>
                )}
                
                <Text style={styles.referralDate}>
                  {new Date(referral.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      
      <BottomNav />
      <SettingsModal />
    </View>
  );

  const BottomNav = () => (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={[styles.navItem, currentScreen === 'dashboard' && styles.navItemActive]}
        onPress={() => setCurrentScreen('dashboard')}
      >
        <Text style={[styles.navText, currentScreen === 'dashboard' && styles.navTextActive]}>
          {t('dashboard')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.navItem, currentScreen === 'addReferral' && styles.navItemActive]}
        onPress={() => setCurrentScreen('addReferral')}
      >
        <Text style={[styles.navText, currentScreen === 'addReferral' && styles.navTextActive]}>
          {t('addReferral')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.navItem, currentScreen === 'history' && styles.navItemActive]}
        onPress={() => setCurrentScreen('history')}
      >
        <Text style={[styles.navText, currentScreen === 'history' && styles.navTextActive]}>
          {t('history')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setShowSettings(true)}
      >
        <Text style={styles.navText}>{t('settings')}</Text>
      </TouchableOpacity>
    </View>
  );

  const SettingsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showSettings}
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('settings')}</Text>
            <TouchableOpacity onPress={() => setShowSettings(false)}>
              <Text style={styles.modalClose}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Language</Text>
              <View style={styles.languageButtons}>
                {[
                  { code: 'en', label: 'English' },
                  { code: 'es', label: 'Español' },
                  { code: 'fr', label: 'Français' },
                  { code: 'ht', label: 'Kreyòl' }
                ].map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.languageButton,
                      language === lang.code && styles.languageButtonActive
                    ]}
                    onPress={() => setLanguage(lang.code)}
                  >
                    <Text style={[
                      styles.languageButtonText,
                      language === lang.code && styles.languageButtonTextActive
                    ]}>
                      {lang.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Payout Method</Text>
              <View style={styles.payoutMethods}>
                <TouchableOpacity
                  style={[
                    styles.payoutMethod,
                    userSettings.payoutMethod === 'paypal' && styles.payoutMethodActive
                  ]}
                  onPress={() => setUserSettings({...userSettings, payoutMethod: 'paypal'})}
                >
                  <Text style={styles.payoutMethodText}>PayPal</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.payoutMethod,
                    userSettings.payoutMethod === 'cashapp' && styles.payoutMethodActive
                  ]}
                  onPress={() => setUserSettings({...userSettings, payoutMethod: 'cashapp'})}
                >
                  <Text style={styles.payoutMethodText}>CashApp</Text>
                </TouchableOpacity>
              </View>
            </View>

            {userSettings.payoutMethod === 'paypal' && (
              <StableTextInput
                label="PayPal Email"
                value={userSettings.paypalEmail}
                onChangeText={(text) => setUserSettings({...userSettings, paypalEmail: text})}
                placeholder="your@paypal.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}

            {userSettings.payoutMethod === 'cashapp' && (
              <StableTextInput
                label="CashApp Tag"
                value={userSettings.cashappTag}
                onChangeText={(text) => setUserSettings({...userSettings, cashappTag: text})}
                placeholder="$yourtag"
                autoCapitalize="none"
              />
            )}

            <View style={styles.settingItem}>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Switch
                  value={userSettings.notifications}
                  onValueChange={(value) => setUserSettings({...userSettings, notifications: value})}
                  trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                  thumbColor={userSettings.notifications ? '#ffffff' : '#f9fafb'}
                />
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Auto Payouts</Text>
                <Switch
                  value={userSettings.autoPayouts}
                  onValueChange={(value) => setUserSettings({...userSettings, autoPayouts: value})}
                  trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                  thumbColor={userSettings.autoPayouts ? '#ffffff' : '#f9fafb'}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.signOutButton}
              onPress={() => {
                setShowSettings(false);
                handleLogout();
              }}
            >
              <Text style={styles.signOutText}>{t('signOut')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      {user ? (
        currentScreen === 'dashboard' ? renderDashboard() :
        currentScreen === 'addReferral' ? renderAddReferral() :
        currentScreen === 'history' ? renderHistory() :
        renderDashboard()
      ) : (
        currentScreen === 'register' ? renderRegister() : renderLogin()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
    minHeight: 50,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputDisabled: {
    backgroundColor: '#2d3748',
    color: '#9ca3af',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#6b7280',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 16,
  },
  languageSelector: {
    alignItems: 'center',
    marginTop: 30,
  },
  languageLabel: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 10,
  },
  languageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: '#3b82f6',
  },
  languageButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  languageButtonTextActive: {
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  statsCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    minWidth: 150,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  tierContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tierCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tierCardActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a8a',
  },
  tierTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  tierCommission: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  tierRange: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  pickerOptionActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  pickerOptionText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  pickerOptionTextActive: {
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#9ca3af',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  referralsList: {
    gap: 16,
  },
  referralCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
  },
  referralHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  referralName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusCompleted: {
    backgroundColor: '#10b981',
  },
  statusApproved: {
    backgroundColor: '#3b82f6',
  },
  statusPending: {
    backgroundColor: '#f59e0b',
  },
  statusRejected: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  referralDetails: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  referralCommission: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    marginTop: 8,
  },
  referralDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#374151',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    borderTopWidth: 1,
    borderTopColor: '#4b5563',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: '#1e40af',
    borderRadius: 8,
  },
  navText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
  },
  navTextActive: {
    color: '#ffffff',
  },
  signOutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalClose: {
    fontSize: 30,
    color: '#9ca3af',
    lineHeight: 30,
  },
  modalBody: {
    padding: 20,
  },
  settingItem: {
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  payoutMethods: {
    flexDirection: 'row',
    gap: 12,
  },
  payoutMethod: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#4b5563',
  },
  payoutMethodActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a8a',
  },
  payoutMethodText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
