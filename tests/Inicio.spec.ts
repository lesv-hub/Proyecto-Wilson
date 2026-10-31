import { test, expect } from '@playwright/test';

test('TC-INI-01 - Ordenar alfabéticamente', async ({ page }) => {

    // Paso 1: Abrir la página principal
    await page.goto('https://practicesoftwaretesting.com/');

    await expect(page).toHaveTitle(
        'Practice Software Testing - Toolshop - v5.0'
    );

    // Paso 2: Iniciar sesión
    await page.getByTestId('nav-sign-in').click();

    await page.getByTestId('email').fill(
        'customer@practicesoftwaretesting.com'
    );

    await page.getByTestId('password').fill('welcome01');

    await page.getByTestId('login-submit').click();

    // Paso 3: Validar acceso a la cuenta
    await expect(page).toHaveURL(/\/account/);

    // Paso 4: Ir al inicio
    await page.getByTestId('nav-home').click();

    // Paso 5: Identificar los productos
    const productos = page.getByTestId('product-name');

    await expect(productos.first()).toBeVisible();

    const primerProducto = await productos.first().innerText();

    console.log('Primer producto antes de ordenar:', primerProducto);

    // Paso 6: Seleccionar orden alfabético
    await page.getByTestId('sort').selectOption({
        label: 'Nombre (A - Z)'
    });

    // Paso 7: Esperar que el catálogo se actualice
    await expect.poll(async () => {
        return await productos.first().innerText();
    }).not.toBe(primerProducto);

    // Paso 8: Obtener los nombres actualizados
    const nombres = await productos.allInnerTexts();

    console.log('Productos después de ordenar:', nombres);

    // Paso 9: Validar orden alfabético
    const nombresEsperados = [...nombres].sort((a, b) =>
        a.trim().localeCompare(b.trim(), 'en', {
            sensitivity: 'base'
        })
    );

    expect(nombres).toEqual(nombresEsperados);

    console.log('Ordenamiento alfabético validado correctamente');
});