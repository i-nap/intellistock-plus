package com.intellistock.backend.common.config;

import com.intellistock.backend.common.constants.InventoryMovementType;
import com.intellistock.backend.common.constants.InventoryStatus;
import com.intellistock.backend.inventory.InventoryItem;
import com.intellistock.backend.inventory.InventoryLog;
import com.intellistock.backend.inventory.InventoryLogRepository;
import com.intellistock.backend.inventory.InventoryRepository;
import com.intellistock.backend.order.OrderItem;
import com.intellistock.backend.order.OrderRepository;
import com.intellistock.backend.order.OrderStatus;
import com.intellistock.backend.order.PurchaseOrder;
import com.intellistock.backend.product.Product;
import com.intellistock.backend.product.ProductRepository;
import com.intellistock.backend.product.ProductUnit;
import com.intellistock.backend.supplier.Supplier;
import com.intellistock.backend.supplier.SupplierRepository;
import com.intellistock.backend.user.Role;
import com.intellistock.backend.user.User;
import com.intellistock.backend.user.UserRepository;
import com.intellistock.backend.warehouse.Warehouse;
import com.intellistock.backend.warehouse.WarehouseRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
public class DataSeeder implements ApplicationRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private WarehouseRepository warehouseRepository;
    @Autowired private SupplierRepository supplierRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private InventoryRepository inventoryRepository;
    @Autowired private InventoryLogRepository inventoryLogRepository;
    @Autowired private OrderRepository orderRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Warehouse demo = seedDemoWarehouse();
        seedAdmin(demo);
        if (supplierRepository.count() > 0) {
            log.info("[Seeder] Demo data already present — skipping.");
            return;
        }
        List<Supplier> suppliers = seedSuppliers(demo);
        List<Product> products = seedProducts(demo);
        List<InventoryItem> inventory = seedInventory(products);
        seedOrders(suppliers, products, inventory, demo);
        log.info("[Seeder] Demo data seeded — {} suppliers, {} products, {} orders.",
                suppliers.size(), products.size(), orderRepository.count());
    }

    // ── Warehouse ─────────────────────────────────────────────────────────────

    private Warehouse seedDemoWarehouse() {
        return warehouseRepository.findByName("Demo Warehouse")
                .orElseGet(() -> warehouseRepository.save(
                        Warehouse.builder().name("Demo Warehouse").build()
                ));
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    private void seedAdmin(Warehouse warehouse) {
        String adminEmail = "admin@email.com";
        if (userRepository.existsByEmail(adminEmail)) return;
        userRepository.save(User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode("Admin@123"))
                .name("Admin User")
                .role(Role.ADMIN)
                .warehouse(warehouse)
                .build());
        log.info("[Seeder] Admin seeded — {}  |  Admin@123", adminEmail);
    }

    // ── Suppliers ─────────────────────────────────────────────────────────────

    private List<Supplier> seedSuppliers(Warehouse w) {
        return supplierRepository.saveAll(List.of(
                supplier("TechZone Nepal", "techzone@supplier.np", "+977-1-4412345",
                        "Durbar Marg, Kathmandu", "Bikash Shrestha", "techzonenepal.com", w),
                supplier("FabricNepal", "fabric@supplier.np", "+977-1-4523456",
                        "New Road, Kathmandu", "Sita Tamang", "fabricnepal.com", w),
                supplier("FoodDistrib Nepal", "food@supplier.np", "+977-1-4634567",
                        "Kalimati Market, Kathmandu", "Ram Prasad Adhikari", "fooddistrib.np", w),
                supplier("ToolMaster Nepal", "tools@supplier.np", "+977-1-4745678",
                        "Tripureshwor, Kathmandu", "Hari Bahadur KC", "toolmaster.np", w),
                supplier("SafetyPro Nepal", "safety@supplier.np", "+977-1-4856789",
                        "Patan Industrial Estate, Lalitpur", "Sunita Gurung", "safetypro.np", w)
        ));
    }

    // ── Products ──────────────────────────────────────────────────────────────

    private List<Product> seedProducts(Warehouse w) {
        return productRepository.saveAll(List.of(
                product("USB-C Hub 7-in-1", "ELEC-001", "Electronics", "7-port USB-C hub with HDMI, USB 3.0, and SD card slots", ProductUnit.PIECE, "2500.00", w),
                product("Wireless Headphones", "ELEC-002", "Electronics", "Over-ear noise-cancelling wireless headphones", ProductUnit.PIECE, "4800.00", w),
                product("Laptop Stand Aluminium", "ELEC-003", "Electronics", "Adjustable aluminium laptop stand for 11–17 inch laptops", ProductUnit.PIECE, "1800.00", w),
                product("Mechanical Keyboard", "ELEC-004", "Electronics", "TKL mechanical keyboard with blue switches", ProductUnit.PIECE, "6500.00", w),
                product("Cotton T-Shirt (M)", "CLO-001", "Clothing", "100% cotton plain T-shirt, medium size", ProductUnit.PIECE, "650.00", w),
                product("Denim Jeans (32x32)", "CLO-002", "Clothing", "Classic straight-fit denim jeans", ProductUnit.PIECE, "2200.00", w),
                product("Fleece Hoodie", "CLO-003", "Clothing", "Warm fleece pullover hoodie, unisex", ProductUnit.PIECE, "1800.00", w),
                product("Running Shorts", "CLO-004", "Clothing", "Lightweight moisture-wicking running shorts", ProductUnit.PIECE, "950.00", w),
                product("Instant Coffee 500g", "FOOD-001", "Food & Beverages", "Premium instant coffee granules", ProductUnit.KG, "750.00", w),
                product("Green Tea 100pk", "FOOD-002", "Food & Beverages", "Organic green tea bags, pack of 100", ProductUnit.BOX, "480.00", w),
                product("Energy Bars Box (12pk)", "FOOD-003", "Food & Beverages", "Mixed flavour energy bars, box of 12", ProductUnit.BOX, "1200.00", w),
                product("Mineral Water 12pk", "FOOD-004", "Food & Beverages", "500ml mineral water bottles, pack of 12", ProductUnit.BOX, "360.00", w),
                product("Safety Gloves (L)", "TOOL-001", "Tools", "Heavy-duty cut-resistant safety gloves, large", ProductUnit.PIECE, "850.00", w),
                product("Hard Hat (White)", "TOOL-002", "Tools", "ANSI-certified adjustable hard hat", ProductUnit.PIECE, "1200.00", w),
                product("Steel Toe Boots (42)", "TOOL-003", "Tools", "Waterproof steel toe safety boots, size 42", ProductUnit.PIECE, "3500.00", w),
                product("Safety Vest (Hi-Vis)", "TOOL-004", "Tools", "High-visibility reflective safety vest", ProductUnit.PIECE, "950.00", w),
                product("A4 Paper 500 Sheets", "STAT-001", "Stationery", "80gsm A4 copy paper, 500 sheets per ream", ProductUnit.BOX, "480.00", w),
                product("Ballpoint Pens 12pk", "STAT-002", "Stationery", "Black ballpoint pens, box of 12", ProductUnit.BOX, "180.00", w),
                product("Sticky Notes 5pk", "STAT-003", "Stationery", "76x76mm sticky notes, 5 pads assorted colours", ProductUnit.BOX, "250.00", w),
                product("Whiteboard Markers 6pk", "STAT-004", "Stationery", "Assorted colour dry-erase markers, pack of 6", ProductUnit.BOX, "320.00", w)
        ));
    }

    // ── Inventory ─────────────────────────────────────────────────────────────

    private record InvConfig(int qty, int threshold, String location) {}

    private List<InventoryItem> seedInventory(List<Product> products) {
        List<InvConfig> config = List.of(
                new InvConfig(85,  20, "Shelf A1"), new InvConfig(12,  15, "Shelf A2"),
                new InvConfig(48,  10, "Shelf A3"), new InvConfig(6,   20, "Shelf A4"),
                new InvConfig(120, 30, "Shelf B1"), new InvConfig(55,  20, "Shelf B2"),
                new InvConfig(8,   25, "Shelf B3"), new InvConfig(0,   20, "Shelf B4"),
                new InvConfig(90,  25, "Shelf C1"), new InvConfig(200, 50, "Shelf C2"),
                new InvConfig(18,  20, "Shelf C3"), new InvConfig(0,   30, "Shelf C4"),
                new InvConfig(65,  15, "Shelf D1"), new InvConfig(42,  10, "Shelf D2"),
                new InvConfig(28,  10, "Shelf D3"), new InvConfig(5,   20, "Shelf D4"),
                new InvConfig(300, 50, "Shelf E1"), new InvConfig(150, 30, "Shelf E2"),
                new InvConfig(80,  20, "Shelf E3"), new InvConfig(110, 25, "Shelf E4")
        );

        List<InventoryItem> items = new java.util.ArrayList<>();
        for (int i = 0; i < products.size(); i++) {
            Product p = products.get(i);
            InvConfig c = config.get(i);
            InventoryStatus status = c.qty() <= 0 ? InventoryStatus.OUT_OF_STOCK
                    : c.qty() <= c.threshold() ? InventoryStatus.LOW_STOCK
                    : InventoryStatus.IN_STOCK;
            items.add(InventoryItem.builder()
                    .product(p).quantity(c.qty()).reorderThreshold(c.threshold())
                    .location(c.location()).status(status).build());
        }

        List<InventoryItem> saved = inventoryRepository.saveAll(items);
        inventoryLogRepository.saveAll(saved.stream()
                .filter(i -> i.getQuantity() > 0)
                .map(i -> InventoryLog.builder()
                        .inventoryItem(i).movementType(InventoryMovementType.INITIAL)
                        .quantityChange(i.getQuantity()).previousQuantity(0).newQuantity(i.getQuantity())
                        .note("Initial stock").createdBy("admin@intellistock.com").build())
                .toList());
        return saved;
    }

    // ── Orders ────────────────────────────────────────────────────────────────

    private void seedOrders(List<Supplier> suppliers, List<Product> products,
                             List<InventoryItem> inventory, Warehouse w) {
        createOrder(suppliers.get(0), OrderStatus.DELIVERED, LocalDateTime.now().minusDays(20),
                LocalDate.now().minusDays(14), "Restocked electronics for Q2", inventory,
                new int[][]{{0, 50}, {1, 30}}, products, w);
        createOrder(suppliers.get(2), OrderStatus.DELIVERED, LocalDateTime.now().minusDays(15),
                LocalDate.now().minusDays(10), "Monthly food & beverage restock", inventory,
                new int[][]{{8, 40}, {9, 100}, {11, 60}}, products, w);
        createOrder(suppliers.get(3), OrderStatus.DELIVERED, LocalDateTime.now().minusDays(10),
                LocalDate.now().minusDays(5), "Safety gear batch", inventory,
                new int[][]{{12, 30}, {13, 25}, {14, 20}}, products, w);
        createOrder(suppliers.get(1), OrderStatus.PROCESSING, LocalDateTime.now().minusDays(5),
                LocalDate.now().plusDays(3), "Clothing restock order", inventory,
                new int[][]{{4, 80}, {5, 40}, {6, 50}}, products, w);
        createOrder(suppliers.get(4), OrderStatus.PROCESSING, LocalDateTime.now().minusDays(3),
                LocalDate.now().plusDays(5), "Hi-vis vests and gloves", inventory,
                new int[][]{{12, 50}, {15, 40}}, products, w);
        createOrder(suppliers.get(0), OrderStatus.PENDING, LocalDateTime.now().minusDays(1),
                LocalDate.now().plusDays(7), "Q3 electronics order", inventory,
                new int[][]{{1, 20}, {3, 10}}, products, w);
        createOrder(suppliers.get(2), OrderStatus.PENDING, LocalDateTime.now(),
                LocalDate.now().plusDays(4), null, inventory,
                new int[][]{{10, 30}, {11, 50}, {9, 80}}, products, w);
        createOrder(suppliers.get(1), OrderStatus.CANCELLED, LocalDateTime.now().minusDays(8),
                null, "Cancelled — supplier out of stock", inventory,
                new int[][]{{7, 60}}, products, w);
    }

    private void createOrder(Supplier supplier, OrderStatus status,
                              LocalDateTime orderedAt, LocalDate expectedDelivery,
                              String notes, List<InventoryItem> inventory,
                              int[][] items, List<Product> products, Warehouse w) {
        PurchaseOrder order = PurchaseOrder.builder()
                .supplier(supplier).warehouse(w).status(status).notes(notes)
                .expectedDelivery(expectedDelivery).orderedAt(orderedAt)
                .createdBy("admin@intellistock.com").build();
        order = orderRepository.save(order);
        order.setOrderNumber(String.format("PO-%d-%04d", orderedAt.getYear(), order.getId()));

        BigDecimal total = BigDecimal.ZERO;
        for (int[] item : items) {
            Product p = products.get(item[0]);
            int qty = item[1];
            BigDecimal subtotal = p.getUnitPrice().multiply(BigDecimal.valueOf(qty));
            order.getItems().add(OrderItem.builder()
                    .order(order).product(p).quantity(qty)
                    .unitPrice(p.getUnitPrice()).subtotal(subtotal).build());
            total = total.add(subtotal);

            if (status == OrderStatus.DELIVERED) {
                InventoryItem inv = inventory.stream()
                        .filter(i -> i.getProduct().getId().equals(p.getId()))
                        .findFirst().orElse(null);
                if (inv != null) {
                    int prev = inv.getQuantity();
                    int newQty = prev + qty;
                    inv.setQuantity(newQty);
                    inv.recalculateStatus();
                    inventoryRepository.save(inv);
                    inventoryLogRepository.save(InventoryLog.builder()
                            .inventoryItem(inv).movementType(InventoryMovementType.RESTOCK)
                            .quantityChange(qty).previousQuantity(prev).newQuantity(newQty)
                            .note("Received from " + order.getOrderNumber())
                            .createdBy("admin@intellistock.com").build());
                }
            }
        }
        order.setTotalAmount(total);
        orderRepository.save(order);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Supplier supplier(String name, String email, String phone,
                               String address, String contactPerson, String website, Warehouse w) {
        return Supplier.builder().name(name).email(email).phone(phone)
                .address(address).contactPerson(contactPerson).website(website).warehouse(w).build();
    }

    private Product product(String name, String sku, String category,
                             String description, ProductUnit unit, String price, Warehouse w) {
        return Product.builder().name(name).sku(sku).category(category)
                .description(description).unit(unit).unitPrice(new BigDecimal(price)).warehouse(w).build();
    }
}
