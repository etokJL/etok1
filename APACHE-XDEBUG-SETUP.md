# 🔧 Apache Server & XDebug Setup - Lokale Entwicklung

## 📍 **Aktuelle System-Konfiguration**

### **PHP-Konfiguration:**
```bash
# Haupt-php.ini Datei:
/usr/local/etc/php/8.2/php.ini

# XDebug-Konfiguration:
/usr/local/etc/php/8.2/conf.d/ext-xdebug.ini

# Zusätzliche .ini-Dateien:
/usr/local/etc/php/8.2/conf.d/ext-opcache.ini
```

### **Apache-Konfiguration:**
```bash
# Apache Version: 2.4.62
# Hauptkonfiguration: /usr/local/etc/httpd/httpd.conf
# Document Root: /usr/local/var/www
# Error Log: /usr/local/var/log/httpd/error_log
# PID File: /usr/local/var/run/httpd/httpd.pid
```

---

## 🎯 **XDebug Aktivieren/Deaktivieren**

### **Aktuelle XDebug-Einstellungen:**
```ini
# Datei: /usr/local/etc/php/8.2/conf.d/ext-xdebug.ini
zend_extension=xdebug
xdebug.mode=develop
xdebug.start_with_request=no
xdebug.client_discovery_header=""
```

### **✅ XDebug AKTIVIEREN:**
```bash
# Option 1: Konfigurationsdatei bearbeiten
sudo nano /usr/local/etc/php/8.2/conf.d/ext-xdebug.ini

# Inhalt für vollständige XDebug-Aktivierung:
zend_extension=xdebug
xdebug.mode=develop,debug
xdebug.start_with_request=yes
xdebug.client_host=localhost
xdebug.client_port=9003
xdebug.log=/tmp/xdebug.log
xdebug.idekey=VSCODE

# Option 2: Temporär für eine Sitzung
export XDEBUG_CONFIG="idekey=VSCODE"
php -dxdebug.mode=debug,develop your-script.php
```

### **❌ XDebug DEAKTIVIEREN:**
```bash
# Option 1: Komplett deaktivieren
sudo nano /usr/local/etc/php/8.2/conf.d/ext-xdebug.ini

# Inhalt auskommentieren:
; zend_extension=xdebug
; xdebug.mode=develop
; xdebug.start_with_request=no

# Option 2: Nur Debug-Modus deaktivieren
xdebug.mode=off

# Option 3: XDebug-Datei temporär umbenennen
sudo mv /usr/local/etc/php/8.2/conf.d/ext-xdebug.ini /usr/local/etc/php/8.2/conf.d/ext-xdebug.ini.disabled
```

### **🔄 Änderungen anwenden:**
```bash
# PHP-FPM neu starten (falls verwendet)
brew services restart php

# Apache neu starten
brew services restart httpd

# Oder nur Apache reload
sudo httpd -k graceful

# Status überprüfen
php -m | grep -i xdebug
```

---

## 🌐 **Apache Server für Booster Projekt konfigurieren**

### **1. Virtual Host für Booster Backend erstellen:**
```bash
# Apache-Konfiguration öffnen
sudo nano /usr/local/etc/httpd/httpd.conf

# Virtual Hosts aktivieren (Zeile uncommentieren):
Include /usr/local/etc/httpd/extra/httpd-vhosts.conf
```

### **2. Booster Virtual Host konfigurieren:**
```bash
# Virtual Host Datei bearbeiten
sudo nano /usr/local/etc/httpd/extra/httpd-vhosts.conf

# Booster Backend Virtual Host hinzufügen:
<VirtualHost *:8282>
    ServerName booster.local
    DocumentRoot /Users/jgtcdghun/workspace/booster/backend/public
    DirectoryIndex index.php
    
    <Directory /Users/jgtcdghun/workspace/booster/backend/public>
        AllowOverride All
        Require all granted
        
        # Laravel URL Rewriting
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^(.*)$ index.php [QSA,L]
    </Directory>
    
    # PHP-FPM Configuration
    <FilesMatch \.php$>
        SetHandler "proxy:fcgi://127.0.0.1:9000"
    </FilesMatch>
    
    # Logging
    ErrorLog /usr/local/var/log/httpd/booster_error.log
    CustomLog /usr/local/var/log/httpd/booster_access.log combined
    
    # XDebug für Development
    SetEnv XDEBUG_CONFIG "idekey=VSCODE"
</VirtualHost>
```

### **3. PHP-FPM für Apache konfigurieren:**
```bash
# PHP-FPM Konfiguration überprüfen
sudo nano /usr/local/etc/php/8.2/php-fpm.d/www.conf

# Wichtige Einstellungen:
listen = 127.0.0.1:9000
listen.owner = _www
listen.group = _www
listen.mode = 0660
user = _www
group = _www
```

### **4. Hosts-Datei aktualisieren:**
```bash
# Hosts-Datei bearbeiten
sudo nano /etc/hosts

# Booster lokale Domain hinzufügen:
127.0.0.1   booster.local
```

---

## 🚀 **Server-Dienste verwalten**

### **Apache starten/stoppen:**
```bash
# Apache starten
brew services start httpd

# Apache stoppen  
brew services stop httpd

# Apache neu starten
brew services restart httpd

# Status überprüfen
brew services list | grep httpd

# Manueller Start (für Tests)
sudo httpd -D FOREGROUND
```

### **PHP-FPM starten/stoppen:**
```bash
# PHP-FPM starten
brew services start php@8.2

# PHP-FPM stoppen
brew services stop php@8.2

# PHP-FPM neu starten
brew services restart php@8.2

# Status überprüfen
brew services list | grep php
```

---

## 🔧 **Debugging & Troubleshooting**

### **Apache-Status überprüfen:**
```bash
# Konfiguration testen
httpd -t

# Virtual Hosts anzeigen
httpd -S

# Geladene Module anzeigen
httpd -M | grep php

# Apache Prozesse anzeigen
ps aux | grep httpd
```

### **PHP-Status überprüfen:**
```bash
# PHP-Version und Konfiguration
php -v
php --ini

# Geladene Module
php -m

# XDebug-Status
php -m | grep -i xdebug
php -i | grep -i xdebug

# PHP-FPM Status
php-fpm82 -t
```

### **Log-Dateien überwachen:**
```bash
# Apache Error Log
tail -f /usr/local/var/log/httpd/error_log

# Booster Error Log
tail -f /usr/local/var/log/httpd/booster_error.log

# PHP-FPM Log
tail -f /usr/local/var/log/php-fpm.log

# XDebug Log
tail -f /tmp/xdebug.log
```

---

## ⚡ **Performance-Optimierungen**

### **Apache-Optimierungen:**
```apache
# In httpd.conf oder Virtual Host
<Directory /Users/jgtcdghun/workspace/booster/backend/public>
    # Caching aktivieren
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType text/css "access plus 1 month"
        ExpiresByType application/javascript "access plus 1 month"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType image/jpg "access plus 1 year"
    </IfModule>
    
    # Kompression aktivieren
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/css application/javascript
    </IfModule>
</Directory>
```

### **PHP-Optimierungen:**
```ini
# In /usr/local/etc/php/8.2/php.ini

# Memory Limits
memory_limit = 512M
max_execution_time = 300

# OPcache aktivieren
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000

# Für Development
display_errors = On
error_reporting = E_ALL
log_errors = On
```

---

## 🔄 **Schnell-Commands**

### **XDebug schnell umschalten:**
```bash
# XDebug aktivieren
sudo sed -i '' 's/^;zend_extension/zend_extension/' /usr/local/etc/php/8.2/conf.d/ext-xdebug.ini
sudo sed -i '' 's/xdebug.mode=develop/xdebug.mode=develop,debug/' /usr/local/etc/php/8.2/conf.d/ext-xdebug.ini
brew services restart httpd

# XDebug deaktivieren
sudo sed -i '' 's/^zend_extension/;zend_extension/' /usr/local/etc/php/8.2/conf.d/ext-xdebug.ini
brew services restart httpd
```

### **Alle Services neu starten:**
```bash
# Alle Booster-relevanten Services
brew services restart httpd
brew services restart php@8.2
```

### **Booster mit Apache starten:**
```bash
# Apache-Backend starten (statt Laravel artisan serve)
brew services start httpd
brew services start php@8.2

# Frontend weiterhin mit:
cd frontend && npm run dev

# Hardhat weiterhin mit:
npm run hardhat
```

---

## 📋 **ZugriffsURLs mit Apache**

### **Mit Apache (Port 8282):**
```
Backend:     http://booster.local:8282
Admin:       http://booster.local:8282/admin
API:         http://booster.local:8282/api/v1/stats

Frontend:    http://localhost:3000 (unverändert)
Hardhat:     http://127.0.0.1:8545 (unverändert)
```

### **Ohne Apache (Laravel artisan serve):**
```
Backend:     http://127.0.0.1:8282
Admin:       http://127.0.0.1:8282/admin
API:         http://127.0.0.1:8282/api/v1/stats
```

---

## ✅ **Erfolgreich eingerichtet, wenn:**

- ✅ `brew services list | grep httpd` zeigt "started"
- ✅ `http://booster.local:8282` zeigt Laravel-App
- ✅ `php -m | grep xdebug` zeigt XDebug (wenn aktiviert)
- ✅ Apache Error Log zeigt keine kritischen Fehler
- ✅ PHP-FPM läuft und antwortet

---

**🎉 Ihr lokaler Apache-Server mit XDebug ist jetzt einsatzbereit für das Booster NFT dApp Projekt!**


