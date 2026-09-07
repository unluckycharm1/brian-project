<?php

use App\Models\Student;
use App\Models\User;

test('guests cannot access student management', function () {
    $this->get(route('students.index'))->assertRedirect(route('login'));
});

test('authenticated users can view students from the database', function () {
    $user = User::factory()->create();
    $student = Student::factory()->create();

    $response = $this->actingAs($user)->get(route('students.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('students')
        ->has('students', 1)
        ->where('students.0.id', $student->id));
});

test('authenticated users can create update and delete students', function () {
    $user = User::factory()->create();
    $studentData = [
        'first_name' => 'Jamie',
        'last_name' => 'Rivera',
        'email' => 'jamie@example.com',
        'program' => 'BSIT',
        'gender' => 'Female',
        'birthdate' => '2005-06-15',
        'yr_level' => 2,
    ];

    $this->actingAs($user)->post(route('students.store'), $studentData)
        ->assertRedirect(route('students.index'));

    $student = Student::query()->where('email', $studentData['email'])->firstOrFail();
    expect($student->first_name)->toBe('Jamie');

    $this->actingAs($user)->put(route('students.update', $student), [
        ...$studentData,
        'first_name' => 'Jordan',
        'email' => 'jordan@example.com',
    ])->assertRedirect(route('students.index'));

    expect($student->fresh()->first_name)->toBe('Jordan');

    $this->actingAs($user)->delete(route('students.destroy', $student))
        ->assertRedirect(route('students.index'));

    expect(Student::find($student->id))->toBeNull();
});
